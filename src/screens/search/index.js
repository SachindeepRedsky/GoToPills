import React, { Component } from 'react';
import {
  LogBox,
  View,
  Text,
  ScrollView,
  Linking,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Platform
} from 'react-native';
import MainHeader from '../../components/MainHeader';
import { searchStrings } from '../../constants/title';
import styles from './styles';
import * as api from '../../api/bulletin-service';
import * as searchService from '../../api/search-service';
import Autocomplete from 'react-native-autocomplete-input';
import { Picker } from '@react-native-picker/picker';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
var bullitens = [];
var conditions = [];
import Modal, { ModalContent } from 'react-native-modals';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: {},
      prescribedText: String,
      diagnosedText: String,
      durationText: '',
      ageText: '',
      hasDurationFocus: Boolean,
      hasAgeFocus: Boolean,
      bullitensQuery: '',
      conditionQuery: '',
      hideResults: false,
      hideResults2: false,
      screenHeight: String,
      screenWidth: Number,
      selectedDurationType: 'Days',
      selectedAgeType: 'Years',
      gender: 'Male',
      isSearchDone: false,
      fromBD: false,
      alerts: {
        None: '',
      },
      GenericName: '',
      isGenderPicker: false,
      isDurationPicker: false,
      isAgePicker: false
    };
  }

  resetState = async () => {
    await this.setState({
      searchResults: {},
      prescribedText: String,
      diagnosedText: String,
      durationText: '',
      ageText: '',
      hasDurationFocus: Boolean,
      hasAgeFocus: Boolean,
      bullitensQuery: '',
      conditionQuery: '',
      hideResults: false,
      screenHeight: String,
      screenWidth: Number,
      selectedDurationType: 'Days',
      selectedAgeType: 'Years',
      gender: 'Male',
      isSearchDone: false,
      fromBD: false,
      alerts: {
        None: '',
      },
      GenericName: '',
    });
  };

  componentDidMount = async () => {
    await this.getBullitens();
    await this.getConditions();
  };

  getBullitens = async () => {
    const data = await api.allBulletinsNames();
    for (var i = 0; i < data.length; i++) {
      bullitens.push({ name: data[i] });
    }
  };

  getConditions = async () => {
    const data = await api.allConditionNames();
    for (var i = 0; i < data.length; i++) {
      conditions.push({ name: data[i] });
    }
  };

  findBullitens(query) {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`^${query.trim()}`, 'i');
    return bullitens.filter((bullit) => bullit.name.search(regex) >= 0);
  }

  findConditions(query) {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`^${query.trim()}`, 'i');
    return conditions.filter((condition) => condition.name.search(regex) >= 0);
  }

  selectBullitens(item) {
    // console.log('selecting item :: ', item);
    this.setState({
      //   selectedCustomerId: item.id,
      bullitensQuery: item.name,
      hideResults: true,
    });
  }

  selectConditions(item) {
    // console.log('selecting item :: ', item);
    this.setState({
      //   selectedCustomerId: item.id,
      conditionQuery: item.name,
      hideResults2: true,
    });
  }

  onSearchButton = async () => {
    if (this.state.bullitensQuery.trim() === '') {
      alert('Please provide a drug name.');
      return;
    }
    if (this.state.conditionQuery.trim() === '') {
      alert('Please provide a reason.');
      return;
    }
    var drug = {
      ms: this.state.bullitensQuery,
      reason: this.state.conditionQuery,
      reason: this.state.conditionQuery,
      age: this.state.ageText,
      age_type: this.state.selectedAgeType.toLowerCase(),
      duration: this.state.durationText,
      duration_type: this.state.selectedDurationType.toLowerCase(),
      gender: this.state.gender.toLowerCase(),
    };
    await searchService
      .bulletinSearch(drug)
      .then((result) => {
        if (result.usageAlerts != 'NONE') {
          if (
            this.state.reason != '' &&
            result.usageAlerts.OffLabelUses == null
          ) {
            result.usageAlerts.OffLabelUsesOK =
              'Reason: This drug is approved for the treatment of ' +
              this.state.reason +
              '.';
          }
          if (
            this.state.ageText != '' &&
            result.usageAlerts.MinimumAge == null &&
            result.usageAlerts.MaximumAge == null
          ) {
            result.usageAlerts.MinimumAgeOK =
              'Min. Age: This drug is approved for use by patients older than ' +
              this.state.ageText +
              ' old.';
          }
          if (
            this.state.durationText != '' &&
            result.usageAlerts.UsageDuration == null
          ) {
            result.usageAlerts.UsageDurationOK =
              'Duration: This drug is approved for up to ' +
              this.state.durationText +
              ' ' +
              this.state.selectedDurationType +
              ' of use.';
          }

          if (this.state.gender != '' && result.usageAlerts.gender == null) {
            result.usageAlerts.genderOK =
              'Gender: This drug is approved for ' + this.state.gender + 's.';
          }
          //update model
          let searchResults = result;
          this.setState({
            searchResults: searchResults,
            alerts: result.usageAlerts,
          });
          this.setState({
            isSearchDone: true,
          });
        } else {
          let searchResults = result;
          result.usageAlerts = { None: 'No Off Label Results Found' };

          this.setState({
            searchResults: searchResults,
            alerts: result.usageAlerts,
          });
          this.setState({
            isSearchDone: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Unfortunately this search failed.');
      });
  };

  UNSAFE_componentWillReceiveProps() {
    this.resetState();
  }
  componentDidUpdate() {
    this.checkbd();
  }
  checkbd = async () => {
    try {
      let GenericName = this.props.navigation.state.params.GenericName;
      if (
        GenericName !== undefined &&
        GenericName !== '' &&
        this.state.fromBD === false
      ) {
        await this.setState({
          fromBD: true,
          GenericName: GenericName,
          bullitensQuery: GenericName,
        });
      }
    } catch { }
  };

  toggle(i) {
    if (Platform.OS === 'ios') {
      if (i == 1) {
        if (this.state.isGenderPicker == false) {
          this.setState({ isGenderPicker: true });
        } else {
          this.setState({ isGenderPicker: false });
        }
      } else if (i == 2) {
        if (this.state.isDurationPicker == false) {
          this.setState({ isDurationPicker: true });
        } else {
          this.setState({ isDurationPicker: false });
        }
      } else {
        if (this.state.isAgePicker == false) {
          this.setState({ isAgePicker: true });
        } else {
          this.setState({ isAgePicker: false });
        }
      }
    }
  }

  render() {
    const { bullitensQuery } = this.state;
    const { conditionQuery } = this.state;
    const data = this.findBullitens(bullitensQuery);
    const data1 = this.findConditions(conditionQuery);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    // const a =this.checkbd()
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.container}>
          <MainHeader navigate={this.props.navigation} title={'Search'} />
          {!this.state.isSearchDone ? (
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.textstyle}>{searchStrings.approvedTitle}</Text>

              <View style={{ width: '90%', alignSelf: 'center', height: '100%' }}>
                <View style={styles.inputView}>
                  <Text style={styles.Text}>{searchStrings.prescribedLable}</Text>
                  {this.state.GenericName !== '' &&
                    this.state.GenericName !== undefined &&
                    this.state.GenericName !== null ? (
                      <Text style={styles.textstyle}>{this.state.GenericName}</Text>
                    ) : (
                      <Autocomplete
                        underlineShow={true}
                        autoCorrect={false}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.autocompleteText}
                        // containerStyle={this.state.hideResults ? { height: 100 } : { height: 100 }}
                        listStyle={styles.autocompleteListStyle}
                        data={
                          data.length === 1 && comp(bullitensQuery, data[0].name)
                            ? []
                            : data
                        }
                        defaultValue={bullitensQuery}
                        hideResults={this.state.hideResults}
                        inputContainerStyle={styles.autocompleteInputContainer}
                        onChangeText={(text) =>
                          this.setState({ bullitensQuery: text, hideResults: false })
                        }
                        renderItem={({ item, key }) => (
                          <TouchableOpacity
                            key={key}
                            onPress={() => this.selectBullitens(item)}>
                            <Text style={{ fontSize: 16, paddingLeft: '1%' }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                  {/* <TextInput
                style={styles.inputBox}
                value={this.state.prescribedText}
                onChangeText={text => this.onChangeText(text, 1)}
              /> */}
                  {/* <View style={styles.horizontalline} /> */}
                  <Text style={styles.Text}>{searchStrings.diagnosedLable}</Text>
                  <Autocomplete
                    underlineShow={true}
                    style={styles.autocompleteText}
                    keyExtractor={(item, index) => index.toString()}
                    // containerStyle={styles.autoCompleteContainer1}
                    listContainerStyle={styles.autocompleteListContainerStyle}
                    listStyle={styles.autocompleteListStyle}
                    // placeholder="Enter Customer Name"
                    data={
                      data1.length === 1 && comp(conditionQuery, data1[0].name)
                        ? []
                        : data1
                    }
                    defaultValue={conditionQuery}
                    hideResults={this.state.hideResults2}
                    inputContainerStyle={styles.autocompleteInputContainer}
                    onChangeText={(text) =>
                      this.setState({ conditionQuery: text, hideResults2: false })
                    }
                    renderItem={({ item, key }) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => this.selectConditions(item)}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  {/* <TextInput
                style={styles.inputBox}
                value={this.state.diagnosedText}
                onChangeText={text => this.onChangeText(text, 2)}
              /> */}
                  {/* <View style={styles.horizontalline} /> */}
                  <View style={styles.middleView}>
                    <View style={styles.MiddleFirstView}>
                      <Text style={styles.Textinputbox}>
                        {searchStrings.durationLable}
                      </Text>
                      <TextInput
                        style={styles.inputBox1}
                        placeholder="12"
                        keyboardType={'numeric'}
                        onChangeText={(text) => {
                          this.setState({
                            durationText: text,
                          });
                        }}
                      />
                      <Text style={styles.Textinputbox}>
                        {searchStrings.ageLable}
                      </Text>
                      <TextInput
                        style={styles.inputBox1}
                        keyboardType={'numeric'}
                        placeholder="18"
                        onChangeText={(text) =>
                          this.setState({
                            ageText: text,
                          })
                        }
                      />
                      <Text style={styles.Textinputbox}>
                        {searchStrings.gender}
                      </Text>
                      <View style={[styles.PickerView1, { paddingTop: '7%' }]}>
                        <View style={{ flexDirection: 'row', visibility: 'hidden' }}>
                          <Text style={{ fontSize: 20, color: '#000000', width: '80%' }} onPress={() => this.toggle(1)}>
                            {this.state.gender}
                          </Text>
                          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Image
                              source={require('../../assets/downarrow.png')}
                              style={styles.pickericon}
                            />
                          </View>
                        </View>
                        <Modal visible={this.state.isGenderPicker} onTouchOutside={() => { this.setState({ isGenderPicker: false }) }} width={0.8}>
                          <ModalContent>
                            <Picker
                              mode={'dropdown'}
                              selectedValue={this.state.gender}
                              style={{
                                marginTop: 5,
                                width: '90%',
                                alignSelf: 'center'
                              }}
                              onValueChange={(itemValue) => {
                                this.setState({ gender: itemValue });
                                this.toggle(1);
                              }}>
                              <Picker.Item label="Male" value="Male" />
                              <Picker.Item label="Female" value="Female" />
                            </Picker>
                          </ModalContent>
                        </Modal>
                      </View>
                    </View>
                    <View style={styles.MiddleSecondView}>
                      <View
                        style={[
                          styles.PickerView1,
                          {
                            marginTop: '18%',
                            //  alignSelf: 'flex-end'
                          },
                        ]}>
                        <View style={{ flexDirection: 'row', visibility: 'hidden' }}>
                          <Text style={{ fontSize: 20, color: '#000000', width: '80%' }} onPress={() => this.toggle(2)}>
                            {this.state.selectedDurationType}
                          </Text>
                          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Image
                              source={require('../../assets/downarrow.png')}
                              style={styles.pickericon}
                            />
                          </View>
                        </View>
                        <Modal visible={this.state.isDurationPicker} onTouchOutside={() => { this.setState({ isDurationPicker: false }) }} width={0.8}>
                          <ModalContent>
                            <Picker
                              mode={'dropdown'}
                              selectedValue={this.state.selectedDurationType}
                              style={{
                                marginTop: 5,
                                width: '90%',
                                alignSelf: 'center'
                              }}
                              onValueChange={(itemValue) => {
                                this.setState({ selectedDurationType: itemValue })
                                this.toggle(2);
                              }}
                            >
                              <Picker.Item label="Days" value="Days" />
                              <Picker.Item label="Weeks" value="Weeks" />
                              <Picker.Item label="Months" value="Months" />
                              <Picker.Item label="Years" value="Years" />
                            </Picker>
                          </ModalContent>
                        </Modal>
                      </View>
                      <View style={[styles.PickerView1, { marginTop: '18%' }]}>
                        <View style={{ flexDirection: 'row', visibility: 'hidden' }}>
                          <Text style={{ fontSize: 20, color: '#000000', width: '80%' }} onPress={() => this.toggle(3)}>
                            {this.state.selectedAgeType}
                          </Text>
                          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Image
                              source={require('../../assets/downarrow.png')}
                              style={styles.pickericon}
                            />
                          </View>
                        </View>
                        <Modal visible={this.state.isAgePicker} onTouchOutside={() => { this.setState({ isAgePicker: false }) }} width={0.8}>
                          <ModalContent>
                            <Picker
                              mode={'dropdown'}
                              selectedValue={this.state.selectedAgeType}
                              style={{
                                marginTop: 5,
                                width: '90%',
                                alignSelf: 'center'
                              }}
                              onValueChange={(itemValue) => {
                                this.setState({ selectedAgeType: itemValue });
                                this.toggle(3);
                              }}
                            >
                              <Picker.Item label="Years" value="Years" />
                              <Picker.Item label="Months" value="Months" />
                              <Picker.Item label="Days" value="Days" />
                            </Picker>
                          </ModalContent>
                        </Modal>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.Button, { marginTop: 0 }]}
                    onPress={() => this.onSearchButton()}>
                    <Text style={styles.ButtonText}>
                      {searchStrings.searchBtn}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(searchStrings.privacyUrl)}
                    style={styles.BottomView}>
                    <Text style={styles.BottomText}>
                      {searchStrings.termsTitle}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          ) : (
              <View style={styles.MainBox}>
                <ScrollView>
                  <View style={styles.Item1}>
                    <Text style={styles.datatext}>{'Generic Name:'}</Text>
                    <Text style={styles.titleText}>
                      {this.state.searchResults &&
                        this.state.searchResults.GenericName
                        ? this.state.searchResults.GenericName
                        : 'Searching...'}
                    </Text>
                  </View>
                  <View style={styles.Item1}>
                    <Text style={styles.datatext}>{'Drug Category:'}</Text>
                    <Text style={styles.titleText}>
                      {this.state.searchResults && this.state.searchResults.drugCat
                        ? this.state.searchResults.drugCat
                        : 'Searching...'}
                    </Text>
                  </View>
                  <View style={styles.Item1}>
                    <Text style={styles.datatext}>{'Litigation Alert Level:'}</Text>
                    <Text style={styles.titleText}>
                      {this.state.searchResults &&
                        this.state.searchResults.litAlertLvl
                        ? this.state.searchResults.litAlertLvl
                        : 'Searching...'}
                    </Text>
                  </View>
                  <View style={styles.SubView}>
                    {this.state.alerts && this.state.alerts.OffLabelUses ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={[styles.datatext1]}>
                          {this.state.alerts.OffLabelUses}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.OffLabelUsesOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.OffLabelUsesOK}
                        </Text>
                      </View>
                    ) : null}

                    {this.state.alerts && this.state.alerts.MinimumAge ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.MinimumAge}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.MinimumAgeOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext12}>
                          {this.state.alerts.MinimumAgeOK}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.MaximumAge ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.MaximumAge}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.UsageDuration ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.UsageDuration}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.UsageDurationOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext12}>
                          {this.state.alerts.UsageDurationOK}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.gender ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.gender}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.genderOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext12}>
                          {this.state.alerts.genderOK}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.Conditions ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.Conditions}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.ApprovedOffLabelUses ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.ApprovedOffLabelUses}
                        </Text>
                      </View>
                    ) : null}
                    {/* <Text style={styles.datatext12}>
                  {!this.state.alerts.OffLabelUses ? 'None' : 'Loading...'}
                </Text> */}
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('Bulletindetails', {
                          bullID: this.state.searchResults.bullID,
                          GenericName: this.state.searchResults.GenericName,
                          brandName: this.state.searchResults.brandName,
                        });
                      }}
                      style={styles.Button}>
                      <Text style={styles.ButtonText}>DRUG DETAILS</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )
          }
        </View >
      );
    } else {
      return (
        <View style={styles.container}>
          <MainHeader navigate={this.props.navigation} title={'Search'} />
          {!this.state.isSearchDone ? (
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.textstyle}>{searchStrings.approvedTitle}</Text>

              <View style={{ width: '90%', alignSelf: 'center', height: '100%' }}>
                <View style={styles.inputView}>
                  <Text style={styles.Text}>{searchStrings.prescribedLable}</Text>
                  {this.state.GenericName !== '' &&
                    this.state.GenericName !== undefined &&
                    this.state.GenericName !== null ? (
                      <Text style={styles.textstyle}>{this.state.GenericName}</Text>
                    ) : (
                      <Autocomplete
                        underlineShow={true}
                        autoCorrect={false}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.autocompleteText}
                        // containerStyle={this.state.hideResults ? { height: 100 } : { height: 100 }}
                        listStyle={styles.autocompleteListStyle}
                        data={
                          data.length === 1 && comp(bullitensQuery, data[0].name)
                            ? []
                            : data
                        }
                        defaultValue={bullitensQuery}
                        hideResults={this.state.hideResults}
                        inputContainerStyle={styles.autocompleteInputContainer}
                        onChangeText={(text) =>
                          this.setState({ bullitensQuery: text, hideResults: false })
                        }
                        renderItem={({ item, key }) => (
                          <TouchableOpacity
                            key={key}
                            onPress={() => this.selectBullitens(item)}>
                            <Text style={{ fontSize: 16, paddingLeft: '1%' }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                  {/* <TextInput
                style={styles.inputBox}
                value={this.state.prescribedText}
                onChangeText={text => this.onChangeText(text, 1)}
              /> */}
                  {/* <View style={styles.horizontalline} /> */}
                  <Text style={styles.Text}>{searchStrings.diagnosedLable}</Text>
                  <Autocomplete
                    underlineShow={true}
                    style={styles.autocompleteText}
                    keyExtractor={(item, index) => index.toString()}
                    // containerStyle={styles.autoCompleteContainer1}
                    listContainerStyle={styles.autocompleteListContainerStyle}
                    listStyle={styles.autocompleteListStyle}
                    // placeholder="Enter Customer Name"
                    data={
                      data1.length === 1 && comp(conditionQuery, data1[0].name)
                        ? []
                        : data1
                    }
                    defaultValue={conditionQuery}
                    hideResults={this.state.hideResults2}
                    inputContainerStyle={styles.autocompleteInputContainer}
                    onChangeText={(text) =>
                      this.setState({ conditionQuery: text, hideResults2: false })
                    }
                    renderItem={({ item, key }) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => this.selectConditions(item)}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  {/* <TextInput
                style={styles.inputBox}
                value={this.state.diagnosedText}
                onChangeText={text => this.onChangeText(text, 2)}
              /> */}
                  {/* <View style={styles.horizontalline} /> */}
                  <View style={styles.middleView}>
                    <View style={styles.MiddleFirstView}>
                      <Text style={styles.Textinputbox}>
                        {searchStrings.durationLable}
                      </Text>
                      <TextInput
                        style={styles.inputBox1}
                        placeholder="12"
                        keyboardType={'numeric'}
                        onChangeText={(text) => {
                          this.setState({
                            durationText: text,
                          });
                        }}
                      />
                      <Text style={styles.Textinputbox}>
                        {searchStrings.ageLable}
                      </Text>
                      <TextInput
                        style={styles.inputBox1}
                        keyboardType={'numeric'}
                        placeholder="18"
                        onChangeText={(text) =>
                          this.setState({
                            ageText: text,
                          })
                        }
                      />
                      <Text style={styles.Textinputbox}>
                        {searchStrings.gender}
                      </Text>
                      <View style={[styles.PickerView1, { paddingTop: '7%' }]}>
                        <Picker
                          mode={'dropdown'}
                          selectedValue={this.state.gender}
                          style={styles.dropDown1}
                          onValueChange={(itemValue) => {
                            this.setState({ gender: itemValue });
                          }}>
                          <Picker.Item label="Male" value="male" />
                          <Picker.Item label="Female" value="female" />
                        </Picker>
                      </View>
                    </View>
                    <View style={styles.MiddleSecondView}>
                      <View
                        style={[
                          styles.PickerView1,
                          {
                            paddingTop: '7%',
                            //  alignSelf: 'flex-end'
                          },
                        ]}>
                        <Picker
                          mode={'dropdown'}
                          selectedValue={this.state.selectedDurationType}
                          style={styles.dropDown1}
                          onValueChange={(itemValue) =>
                            this.setState({ selectedDurationType: itemValue })
                          }>
                          <Picker.Item label="Days" value="days" />
                          <Picker.Item label="Weeks" value="weeks" />
                          <Picker.Item label="Months" value="months" />
                          <Picker.Item label="Years" value="years" />
                        </Picker>
                        {/* <Image
                        source={require('../../assets/downarrow.png')}
                        style={styles.pickericon}
                      /> */}
                      </View>
                      <View style={[styles.PickerView1, { paddingTop: '7%' }]}>
                        <Picker
                          mode={'dropdown'}
                          selectedValue={this.state.selectedAgeType}
                          style={styles.dropDown1}
                          onValueChange={(itemValue) =>
                            this.setState({ selectedAgeType: itemValue })
                          }>
                          <Picker.Item label="Years" value="years" />
                          <Picker.Item label="Months" value="months" />
                          <Picker.Item label="Days" value="days" />
                        </Picker>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.Button}
                    onPress={() => this.onSearchButton()}>
                    <Text style={styles.ButtonText}>
                      {searchStrings.searchBtn}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(searchStrings.privacyUrl)}
                    style={styles.BottomView}>
                    <Text style={styles.BottomText}>
                      {searchStrings.termsTitle}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          ) : (
              <View style={styles.MainBox}>
                <ScrollView>
                  <View style={styles.Item1}>
                    <Text style={styles.datatext}>{'Generic Name:'}</Text>
                    <Text style={styles.titleText}>
                      {this.state.searchResults &&
                        this.state.searchResults.GenericName
                        ? this.state.searchResults.GenericName
                        : 'Searching...'}
                    </Text>
                  </View>
                  <View style={styles.Item1}>
                    <Text style={styles.datatext}>{'Drug Category:'}</Text>
                    <Text style={styles.titleText}>
                      {this.state.searchResults && this.state.searchResults.drugCat
                        ? this.state.searchResults.drugCat
                        : 'Searching...'}
                    </Text>
                  </View>
                  <View style={styles.Item1}>
                    <Text style={styles.datatext}>{'Litigation Alert Level:'}</Text>
                    <Text style={styles.titleText}>
                      {this.state.searchResults &&
                        this.state.searchResults.litAlertLvl
                        ? this.state.searchResults.litAlertLvl
                        : 'Searching...'}
                    </Text>
                  </View>
                  <View style={styles.SubView}>
                    {this.state.alerts && this.state.alerts.OffLabelUses ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={[styles.datatext1]}>
                          {this.state.alerts.OffLabelUses}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.OffLabelUsesOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.OffLabelUsesOK}
                        </Text>
                      </View>
                    ) : null}

                    {this.state.alerts && this.state.alerts.MinimumAge ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.MinimumAge}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.MinimumAgeOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext12}>
                          {this.state.alerts.MinimumAgeOK}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.MaximumAge ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.MaximumAge}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.UsageDuration ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.UsageDuration}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.UsageDurationOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext12}>
                          {this.state.alerts.UsageDurationOK}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.gender ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.gender}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.genderOK ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/check.png')}
                          style={styles.pickericon1}></Image>
                        <Text style={styles.datatext12}>
                          {this.state.alerts.genderOK}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.Conditions ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.Conditions}
                        </Text>
                      </View>
                    ) : null}
                    {this.state.alerts && this.state.alerts.ApprovedOffLabelUses ? (
                      <View style={styles.alert}>
                        <Image
                          source={require('../../assets/OffLabelUses.png')}
                          style={styles.pickericon2}></Image>
                        <Text style={styles.datatext1}>
                          {this.state.alerts.ApprovedOffLabelUses}
                        </Text>
                      </View>
                    ) : null}
                    {/* <Text style={styles.datatext12}>
                  {!this.state.alerts.OffLabelUses ? 'None' : 'Loading...'}
                </Text> */}
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('Bulletindetails', {
                          bullID: this.state.searchResults.bullID,
                          GenericName: this.state.searchResults.GenericName,
                          brandName: this.state.searchResults.brandName,
                        });
                      }}
                      style={styles.Button}>
                      <Text style={styles.ButtonText}>DRUG DETAILS</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
        </View>
      );
    }
  }
}
