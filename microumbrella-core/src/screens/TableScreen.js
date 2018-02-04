// @flow
import React, { Component } from "react";
import {
  FlatList,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { NavigationActions } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicon from "react-native-vector-icons/Ionicons";
import ModalPicker from "react-native-modal-picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import { backButtonNavOptions } from "../navigations";
import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import { Text } from "../components/defaultComponents";
import { showAlert, getKeyboardType } from "../../../src/utils";
import type { QuestionTableColumnType } from "../../../types";

let tableValues = [];

const itemSeparatorComponent = ({ highlighted }) => {
  return <View style={styles.separator} />;
};

export default class TableScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    let options = backButtonNavOptions({ navigation });
    const { title, onSaveTable, columns } = navigation.state.params;
    const handleSave = () => onSaveTable(navigation, tableValues);

    options.headerRight = (
      <TouchableOpacity
        accessibilityLabel="table__save-btn"
        onPress={handleSave}
      >
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

  renderField({
    item,
    index
  }: {
    item: QuestionTableColumnType,
    index: number
  }) {
    const field = item;
    let { id, label, choices, responseType, value } = field;
    const { renderError, columns } = this.props.navigation.state.params;
    responseType = [].concat(responseType);
    let inputElement;

    if (
      responseType.indexOf("date") !== -1 ||
      responseType.indexOf("datetime") !== -1
    ) {
      // const eighteenYearsAgo = moment(new Date()).subtract(18, "years");
      const today = moment(new Date());
      const todayStr = today.format("YYYY-MM-DD");
      const maxDate = field.pastOnly ? value || today.toDate() : null;
      const minDate = field.futureOnly ? value : null;
      inputElement = (
        <TouchableOpacity
          accessibilityLabel={"table__field-" + id}
          style={styles.selectContainer}
          onPress={() => this.inputRefs[index].onPressDate()}
        >
          <Text
            style={[
              renderError ? styles.inputErr : styles.selectText,
              { flex: 1 }
            ]}
          >
            Select {label.toLowerCase()}
          </Text>
          <DatePicker
            ref={picker => (this.inputRefs[index] = picker)}
            date={this.state.values[index] || today.toDate()}
            mode="date"
            placeholder=""
            format="YYYY-MM-DD"
            minDate={minDate || undefined}
            maxDate={maxDate || undefined}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            style={{ flex: 1 }}
            customStyles={{
              placeholderText: renderError
                ? styles.inputErr
                : styles.selectText,
              dateInput: styles.dateInput,
              dateText: [styles.selectText, styles.selectTextResult],
              btnTextConfirm: {
                color: colors.primaryAccent
              }
            }}
            onDateChange={dateStr => {
              const values = Object.assign([], this.state.values);
              const date = moment(dateStr).toDate();
              values[index] = date;
              this.setState({ values });
            }}
            iconSource={require("../../images/date-icon.png")}
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
          accessibilityLabel={"table__field-" + id}
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
                renderError ? styles.inputErr : styles.selectText,
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
      const keyboardType = getKeyboardType(responseType);
      inputElement = (
        <TextInput
          keyboardType={keyboardType}
          accessibilityLabel={"table__field-" + id}
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
    return <View style={styles.fieldContainer}>{inputElement}</View>;
  }

  render() {
    const { columns } = this.props.navigation.state.params;
    return (
      <KeyboardAwareScrollView>
        <View style={styles.page}>
          <View style={styles.container}>
            <FlatList
              keyExtractor={item => item.id}
              data={columns}
              renderItem={this.renderField}
              ItemSeparatorComponent={itemSeparatorComponent}
              extraData={this.state.values}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const fieldInputFontSize = 17.5;

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: colors.borderLine,
    borderBottomWidth: 0.8
  },
  modalOption: {
    marginHorizontal: 10,
    backgroundColor: "white"
  },
  whiteBackground: {
    backgroundColor: "white"
  },
  modalOptionText: {
    color: colors.primaryAccent
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
    flex: 1,
    alignItems: "center",
    textAlign: "right",
    color: colors.primaryText
  },
  selectText: {
    color: colors.borderLine,
    fontSize: fieldInputFontSize
  },
  headerRight: {
    marginRight: 15,
    color: colors.primaryAccent,
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
    alignItems: "stretch"
  },
  page: {
    flex: 1,
    backgroundColor: colors.softBorderLine
  }
});
