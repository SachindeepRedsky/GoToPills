import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Linking,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MainHeader from '../../components/MainHeader';
import {searchStrings} from '../../constants/title';
import styles from './styles';
import * as api from '../../api/bulletin-service';
import * as searchService from '../../api/search-service';
import Autocomplete from 'react-native-autocomplete-input';
import {Picker} from 'native-base';

var bullitens = [];
var conditions = [];

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: {},
      prescribedText: String,
      diagnosedText: String,
      durationText: String,
      ageText: String,
      hasDurationFocus: Boolean,
      hasAgeFocus: Boolean,
      bullitensQuery: '',
      conditionQuery: '',
      hideResults: false,
      screenHeight: String,
      screenWidth: Number,
      selectedDurationType: 'Days',
      selectedAgeType: 'Years',
      selectedGender: 'Male',
      isSearchDone: false,
      Data: [
        {name: 'Generic Name:', title: ''},
        {name: 'Drua Category:', title: ''},
        {name: 'Litiqation Alert Level:', title: ''},
      ],
    };
  }

  onChangeText(text, val) {
    if (val == 1) {
      this.setState({
        durationText: text,
      });
      console.log('CHANGING TEXT::::::::', this.state.durationText);
    } else {
      this.setState({
        ageText: text,
      });
      console.log('CHANGING TEXT::::::::', this.state.ageText);
    }
  }

  componentDidMount() {
    this.getBullitens();
    this.getConditions();
  }

  getBullitens = async () => {
    const data = await api.allBulletinsNames();
    for (var i = 0; i < data.length; i++) {
      bullitens.push({name: data[i]});
    }
  };

  getConditions = async () => {
    const data = await api.allConditionNames();
    for (var i = 0; i < data.length; i++) {
      conditions.push({name: data[i]});
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
      hideResults: true,
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
      condition: this.state.conditionQuery,
      age: this.state.ageText,
      age_type: this.state.selectedAgeType,
      duration: this.state.durationText,
      duration_type: this.state.selectedDurationType,
      gender: this.state.gender,
    };
    await searchService
      .bulletinSearch(drug)
      .then((result) => {
        this.setState({
          isSearchDone: true,
        });
        console.log('SEARCH RESPONSE::::::::', result);
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
            this.state.age != '' &&
            result.usageAlerts.MinimumAge == null &&
            result.usageAlerts.MaximumAge == null
          ) {
            result.usageAlerts.MinimumAgeOK =
              'Min. Age: This drug is approved for use by patients older than ' +
              this.state.age +
              ' old.';
          }
          if (
            this.state.duration != '' &&
            result.usageAlerts.UsageDuration == null
          ) {
            result.usageAlerts.UsageDurationOK =
              'Duration: This drug is approved for up to ' +
              this.state.duration +
              ' ' +
              this.state.duration_type +
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
          });
        } else {
          let searchResults = result;
          searchResults.usageAlerts = {None: 'No Off Label Results Found'};
          this.setState({
            searchResults: searchResults,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Unfortunately this search failed.');
      });
  };

  render() {
    const {bullitensQuery} = this.state;
    const {conditionQuery} = this.state;
    const data = this.findBullitens(bullitensQuery);
    const data1 = this.findConditions(conditionQuery);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <MainHeader navigate={this.props.navigation} title={'Search'} />
        {!this.state.isSearchDone ? (
          <ScrollView>
            <Text style={styles.textstyle}>{searchStrings.approvedTitle}</Text>
            <View style={{width: '90%', alignSelf: 'center', height: '100%'}}>
              <View style={styles.inputView}>
                <Text style={styles.Text}>{searchStrings.prescribedLable}</Text>
                <Autocomplete
                  underlineShow={true}
                  style={styles.autocompleteText}
                  // containerStyle={this.state.hideResults ? { height: 100 } : { height: 100 }}
                  listContainerStyle={styles.autocompleteListContainerStyle}
                  listStyle={styles.autocompleteListStyle}
                  // placeholder="Enter Customer Name"
                  data={
                    data.length === 1 && comp(bullitensQuery, data[0].name)
                      ? []
                      : data
                  }
                  defaultValue={bullitensQuery}
                  hideResults={this.state.hideResults}
                  inputContainerStyle={styles.autocompleteInputContainer}
                  onChangeText={(text) =>
                    this.setState({bullitensQuery: text, hideResults: false})
                  }
                  renderItem={({item, i}) => (
                    <TouchableOpacity
                      onPress={() => this.selectBullitens(item)}>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
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
                  hideResults={this.state.hideResults}
                  inputContainerStyle={styles.autocompleteInputContainer}
                  onChangeText={(text) =>
                    this.setState({conditionQuery: text, hideResults: false})
                  }
                  renderItem={({item, i}) => (
                    <TouchableOpacity
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
                      onChangeText={(text) => this.onChangeText(text, 1)}
                    />
                    <Text style={styles.Textinputbox}>
                      {searchStrings.ageLable}
                    </Text>
                    <TextInput
                      style={styles.inputBox1}
                      placeholder="18"
                      onChangeText={(text) => this.onChangeText(text, 2)}
                    />
                    <Text style={styles.Textinputbox}>
                      {searchStrings.gender}
                    </Text>
                  <View style={[styles.PickerView1]}>
                    <Picker
                      selectedValue={this.state.selectedGender}
                      style={styles.dropDown1}
                      onValueChange={(itemValue, key) =>
                        this.setState({selectedGender: itemValue})
                      }>
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                    </Picker>
                    </View>
                  </View>
                  <View style={styles.MiddleSecondView}>
                  <View style={[styles.PickerView1]}>
                    <Picker
                      selectedValue={this.state.selectedDurationType}
                      style={styles.dropDown}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({selectedDurationType: itemValue})
                      }>
                      <Picker.Item label="Days" value="Days" />
                      <Picker.Item label="Weeks" value="Weeks" />
                      <Picker.Item label="Months" value="Months" />
                      <Picker.Item label="Years" value="Years" />
                    </Picker>
                    </View>
                    <View style={[styles.PickerView1]}>
                    <Picker
                      selectedValue={this.state.selectedAgeType}
                      style={styles.dropDown}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({selectedAgeType: itemValue})
                      }>
                      <Picker.Item label="Years" value="Years" />
                      <Picker.Item label="Months" value="Months" />
                      <Picker.Item label="Days" value="Days" />
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
                    : 'Finding Bulletin...'}
                </Text>
              </View>
              <View style={styles.Item1}>
                <Text style={styles.datatext}>{'Drug Category:'}</Text>
                <Text style={styles.titleText}>
                  {this.state.searchResults && this.state.searchResults.drugCat
                    ? this.state.searchResults.drugCat
                    : 'Finding Bulletin...'}
                </Text>
              </View>
              <View style={styles.Item1}>
                <Text style={styles.datatext}>{'Litigation Alert Level:'}</Text>
                <Text style={styles.titleText}>
                  {this.state.searchResults &&
                  this.state.searchResults.litAlertLvl
                    ? this.state.searchResults.litAlertLvl
                    : 'Finding Bulletin...'}
                </Text>
              </View>
              <View style={styles.SubView}>
                {this.state.searchResults &&
                this.state.searchResults.OffLabelUses ? (
                  <Text style={styles.datatext1}>
                    {this.state.searchResults.OffLabelUses}
                  </Text>
                ) : null}
                {this.state.searchResults &&
                this.state.searchResults.OffLabelUsesOK ? (
                  <Text style={styles.datatext1}>
                    {this.state.searchResults.OffLabelUsesOK}
                  </Text>
                ) : null}

                {this.state.searchResults &&
                this.state.searchResults.MinimumAge ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.MinimumAge}
                  </Text>
                ) : null}
                {this.state.searchResults &&
                this.state.searchResults.MinimumAgeOK ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.MinimumAgeOK}
                  </Text>
                ) : null}
                {this.state.searchResults &&
                this.state.searchResults.MaximumAge ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.MaximumAge}
                  </Text>
                ) : null}
                <Text style={styles.datatext12}>
                  {this.state.searchResults &&
                  this.state.searchResults.UsageDuration
                    ? this.state.searchResults.UsageDuration
                    : null}
                </Text>
                {this.state.searchResults &&
                this.state.searchResults.UsageDurationOK ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.UsageDurationOK}
                  </Text>
                ) : null}
                {this.state.searchResults && this.state.searchResults.gender ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.gender}
                  </Text>
                ) : null}
                {this.state.searchResults &&
                this.state.searchResults.genderOK ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.genderOK}
                  </Text>
                ) : null}
                {this.state.searchResults &&
                this.state.searchResults.Conditions ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.Conditions}
                  </Text>
                ) : null}
                {this.state.searchResults &&
                this.state.searchResults.ApprovedOffLabelUses ? (
                  <Text style={styles.datatext12}>
                    {' '}
                    {this.state.searchResults.ApprovedOffLabelUses}
                  </Text>
                ) : null}
                <Text style={styles.datatext12}>
                  {!this.state.searchResults.OffLabelUses
                    ? 'None'
                    : 'Loading...'}
                </Text>
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
