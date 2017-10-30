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
    const { title, onSaveTable, columns } = navigation.state.params;
    const handleSave = () => onSaveTable(navigation, tableValues);

    options.headerRight = (
      <TouchableOpacity onPress={handleSave}>
        <Text style={styles.headerRight}>SAVE</Text>
      </TouchableOpacity>
    );
    const headerTitleStyle = StyleSheet.flatten(options.headerTitleStyle);
    headerTitleStyle.paddingRight = 0;
    options.headerTitleStyle = headerTitleStyle;
    options.title = title;
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
    columns.forEach(column => {
      this.state.values.push(column.value || "");
    });
    tableValues = this.state.values;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.values !== prevState.values) {
      tableValues = this.state.values;
    }
  }

  renderField(field, index) {
    let { id, label, choices, responseType, value } = field;
    const { renderError, columns } = this.props.navigation.state.params;
    responseType = [].concat(responseType);
    let inputElement;

    if (
      responseType.indexOf("date") !== -1 ||
      responseType.indexOf("datetime") !== -1
    ) {
      // const eighteenYearsAgo = moment(new Date()).subtract(18, "years");
      const maxDate = field.pastOnly
        ? value || moment(new Date()).format("YYYY-MM-DD")
        : null;
      const minDate = field.futureOnly ? value : null;
      inputElement = (
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => this.inputRefs[index].onPressDate()}
        >
          <Text
            style={[
              renderError && this.state.values[index] === ""
                ? styles.inputErr
                : styles.selectText,
              { flex: 1 }
            ]}
          >
            Select {label.toLowerCase()}
          </Text>
          <DatePicker
            ref={picker => (this.inputRefs[index] = picker)}
            date={this.state.values[index] ? this.state.values[index] : maxDate}
            mode="date"
            placeholder=""
            format="YYYY-MM-DD"
            minDate={minDate}
            maxDate={maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              placeholderText: renderError
                ? styles.inputErr
                : styles.selectText,
              dateInput: styles.dateInput,
              dateText: [styles.selectText, styles.selectTextResult],
              btnTextConfirm: {
                color: colors.primaryOrange
              }
            }}
            onDateChange={dateStr => {
              const values = Object.assign([], this.state.values);
              const date = moment(dateStr).toDate();
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
          style={styles.whiteBackground}
          cancelStyle={styles.whiteBackground}
          cancelTextStyle={{ color: colors.primaryText }}
          optionStyle={styles.modalOption}
          optionTextStyle={styles.modalOptionText}
          onChange={option => {
            const values = Object.assign([], this.state.values);
            values[index] = option.key;
            this.setState({ values });
          }}
        >
          <View key={index} style={styles.selectContainer}>
            <Text
              style={[
                renderError && this.state.values[index] === ""
                  ? styles.inputErr
                  : styles.selectText,
                { flex: 1 }
              ]}
            >
              Select {lowerlabel}
            </Text>
            <Text
              style={[styles.selectText, styles.selectTextResult, { flex: 1 }]}
            >
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
          underlineColorAndroid="transparent"
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

const fieldInputFontSize = 17.5;

const styles = StyleSheet.create({
  modalOption: {
    marginHorizontal: 10,
    backgroundColor: "white"
  },
  whiteBackground: {
    backgroundColor: "white"
  },
  modalOptionText: {
    color: colors.primaryOrange
  },
  dateInput: {
    alignItems: "flex-end",
    borderWidth: 0
  },
  inputErr: {
    color: colors.errorRed,
    fontSize: fieldInputFontSize
  },
  selectTextResult: {
    // flex: 1,
    alignItems: "center",
    textAlign: "right",
    color: colors.primaryText
  },
  selectText: {
    // flex: 1,
    color: colors.borderLine,
    fontSize: fieldInputFontSize
  },
  headerRight: {
    marginRight: 15,
    color: colors.primaryOrange,
    fontWeight: "500",
    fontSize: 16
  },
  container: {
    backgroundColor: "white"
  },
  input: {
    padding: 15,
    flex: 1,
    color: colors.primaryText,
    fontSize: fieldInputFontSize
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
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
