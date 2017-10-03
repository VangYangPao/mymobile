import React, { Component } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicon from "react-native-vector-icons/Ionicons";
import ModalPicker from "react-native-modal-picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import { backButtonNavOptions } from "./navigations";
import colors from "./colors";
import { Text } from "./defaultComponents";
import { showAlert } from "./utils";

let tableValues = [];

export default class TableScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let options = backButtonNavOptions({ navigation });
    const { itemName, onSaveTable } = navigation.state.params;
    const handleSave = () => {
      const isValid = tableValues.every(v => v !== "");
      if (!isValid) {
        showAlert("The form is incomplete");
        const currentParams = navigation.state.params;
        navigation.setParams({ renderError: true, ...currentParams });
        return;
      }
      onSaveTable(tableValues);
      navigation.dispatch(NavigationActions.back());
    };

    options.headerRight = (
      <TouchableOpacity onPress={handleSave}>
        <Text style={styles.headerRight}>SAVE</Text>
      </TouchableOpacity>
    );
    options.title = "ADD NEW " + itemName.toUpperCase();
    return options;
  };

  constructor(props) {
    super(props);
    this.inputRefs = [];
    this.renderField = this.renderField.bind(this);
    this.state = {
      values: []
    };
    const { columns } = this.props.navigation.state.params;
    for (let i = 0; i < columns.length; i++) {
      this.state.values.push("");
    }
    tableValues = this.state.values;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.values !== prevState.values) {
      tableValues = this.state.values;
    }
  }

  renderField({ id, label, choices, responseType }, index) {
    const { renderError, columns } = this.props.navigation.state.params;
    responseType = [].concat(responseType);
    let inputElement;

    if (
      responseType.indexOf("date") !== -1 ||
      responseType.indexOf("datetime") !== -1
    ) {
      const maxDate = moment(new Date()).format("YYYY-MM-DD");
      inputElement = (
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => this.inputRefs[index].onPressDate()}
        >
          <Text
            style={
              renderError && this.state.values[index] === "" ? (
                styles.inputErr
              ) : (
                styles.selectText
              )
            }
          >
            Select {label.toLowerCase()}
          </Text>
          <DatePicker
            ref={picker => (this.inputRefs[index] = picker)}
            date={this.state.values[index]}
            mode="date"
            placeholder=""
            format="YYYY-MM-DD"
            maxDate={maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              placeholderText: renderError
                ? styles.inputErr
                : styles.selectText,
              dateInput: {
                alignItems: "flex-end",
                borderWidth: 0
              },
              dateText: [styles.selectText, styles.selectTextResult],
              btnTextConfirm: {
                color: colors.primaryOrange
              }
            }}
            onDateChange={date => {
              const values = Object.assign([], this.state.values);
              values[index] = date;
              this.setState({ values });
            }}
          />
        </TouchableOpacity>
      );
    } else if (responseType.indexOf("choice") !== -1) {
      const lowerlabel = label.toLowerCase();
      const data = choices.map(c => ({ label: c.label, key: c.value }));
      const selectedChoice = columns[index].choices.find(
        c => c.value === this.state.values[index]
      );
      inputElement = (
        <ModalPicker
          data={data}
          initValue={"Select " + lowerlabel}
          onChange={option => {
            const values = Object.assign([], this.state.values);
            values[index] = option.key;
            this.setState({ values });
          }}
        >
          <View key={index} style={styles.selectContainer}>
            <Text
              style={
                renderError && this.state.values[index] === "" ? (
                  styles.inputErr
                ) : (
                  styles.selectText
                )
              }
            >
              Select {lowerlabel}
            </Text>
            <Text style={[styles.selectText, styles.selectTextResult]}>
              {selectedChoice ? selectedChoice.label : null}
            </Text>
          </View>
        </ModalPicker>
      );
    } else {
      inputElement = (
        <TextInput
          ref={ti => (this.inputRefs[index] = ti)}
          style={styles.input}
          autoCorrect={false}
          placeholder={label}
          placeholderTextColor={
            renderError ? colors.errorRed : colors.borderLine
          }
          onChangeText={text => {
            const values = this.state.values.slice();
            values[index] = text;
            this.setState({ values });
          }}
          value={this.state.values[index]}
          onSubmitEditing={event => {
            const input = this.inputRefs[index + 1];
            if (input && typeof input.focus === "function") input.focus();
          }}
        />
      );
    }
    return (
      <View key={id} style={styles.fieldContainer}>
        {inputElement}
      </View>
    );
  }

  render() {
    const { columns } = this.props.navigation.state.params;
    return (
      <KeyboardAwareScrollView>
        <View style={styles.page}>
          <View style={styles.container}>{columns.map(this.renderField)}</View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  inputErr: {
    color: colors.errorRed,
    fontSize: 17.5
  },
  selectTextResult: {
    color: colors.primaryText
  },
  selectText: {
    color: colors.borderLine,
    fontSize: 17.5
  },
  headerRight: {
    fontSize: 16,
    marginRight: 15,
    color: colors.primaryOrange
  },
  container: {
    backgroundColor: "white"
  },
  input: {
    padding: 15,
    flex: 1,
    color: colors.primaryText
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15
  },
  fieldContainer: {
    height: 50,
    alignItems: "stretch",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.softBorderLine
  },
  page: {
    flex: 1,
    backgroundColor: colors.softBorderLine
  }
});
