import React, { Component } from "react";
import {
  DatePickerAndroid,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ScrollView,
  Platform,
  Picker,
  Alert,
  ToastAndroid,
  TextInput,
  Animated
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import database from "./HackStorage";
import POLICIES from "../data/policies";
import RangeSlider from "./RangeSlider";
import { Text } from "./defaultComponents";
import colors from "./colors";
import { getDateStr } from "./utils";
import Button from "./Button";
import { validateAnswer, ValidationResult } from "../data/questions";

const imageHeight = 150;
const imageWidth = 100;

export class MyDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.minDate !== this.props.minDate) {
      this.setState({ date: this.props.minDate });
    }
  }

  onPickDate(dateStr) {
    const date = moment(dateStr).toDate();
    this.setState({ date }, () => this.props.onPickDate(this.props.mode, date));
  }

  render() {
    const now = new Date();
    const mode = this.props.mode || "datetime";
    const format = mode === "datetime" ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
    const maxDate = this.props.pastOnly ? now : undefined;
    let minDate = this.props.futureOnly ? now : undefined;
    if (this.props.minDate) {
      minDate = this.props.minDate;
    }
    return (
      <DatePicker
        style={{ flex: 1, paddingHorizontal: 10 }}
        date={this.state.date}
        mode={mode}
        placeholder="SELECT DATE"
        format={format}
        maxDate={maxDate}
        minDate={minDate}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          },
          btnTextConfirm: {
            color: colors.primaryOrange
          }
        }}
        onDateChange={this.onPickDate.bind(this)}
      />
    );
  }
}

const BAR_WIDTH = 300;
const BAR_HEIGHT_PERCENT = 0.045;
const SLOT_RADIUS_PERCENT = 0.075;
const SLIDER_RADIUS_PERCENT = 0.15;

export class CoverageDurationWidget extends Component {
  constructor(props) {
    super(props);
    this.coverageDurations = [1, 3, 6, 12];
    this.state = {
      months: this.coverageDurations[0]
    };
  }

  render() {
    const elements = this.coverageDurations.map(d => ({
      label: d + "m",
      value: d
    }));
    const { months } = this.state;
    const s = months > 1 ? "S" : "";
    const totalPremium = (this.props.monthlyPremium * months).toFixed(2);
    const buttonText = `CHOOSE ${months + ""} MONTH${s} - $${totalPremium}`;
    return (
      <View style={widgetStyles.durationContainer}>
        <Button
          onPress={() => {
            if (!this.props.onSelectDuration) return;
            this.props.onSelectDuration(this.state.months);
          }}
          containerStyle={widgetStyles.confirmButtonContainer}
        >
          {buttonText}
        </Button>
        <RangeSlider
          elements={elements}
          onValueChange={months => this.setState({ months })}
          containerStyle={{
            marginBottom: 20
          }}
        />
      </View>
    );
  }
}

export class MultipleImagePicker extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.handleFinishSelectImages = this.handleFinishSelectImages.bind(this);
    this.handleSkipUpload = this.handleSkipUpload.bind(this);
    this.state = { images: [] };
  }

  handlePress() {
    ImagePicker.showImagePicker(this.options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        this.setState({ images: this.state.images.concat(response.uri) });
      }
    });
  }

  handleFinishSelectImages() {
    if (this.state.images < 1) {
      Alert.alert("Must upload at least one image");
      return;
    }
    this.props.onFinishSelectImages(this.state.images);
  }

  handleSkipUpload() {
    this.props.onFinishSelectImages([]);
  }

  renderImage(imageUri, idx, images) {
    return (
      <Image
        key={idx}
        source={{ uri: imageUri }}
        style={[
          widgetStyles.pickedImage,
          idx === images.length - 1 ? widgetStyles.lastImage : null
        ]}
        resizeMode="cover"
      />
    );
  }

  render() {
    return (
      <View style={widgetStyles.imageGalleryContainer}>
        <Text style={widgetStyles.imageGalleryTitle}>
          Press on the '+'{"\n"}to start adding images
        </Text>
        <ScrollView horizontal={true} style={widgetStyles.imageGallery}>
          <TouchableOpacity activeOpacity={0.7} onPress={this.handlePress}>
            <View style={[widgetStyles.pickedImage, widgetStyles.emptyImage]}>
              <Icon name="add" size={55} style={widgetStyles.plusIcon} />
            </View>
          </TouchableOpacity>
          {this.state.images.reverse().map(this.renderImage)}
        </ScrollView>
        <Button
          onPress={this.handleFinishSelectImages}
          style={widgetStyles.confirmUpload}
        >
          UPLOAD IMAGES
        </Button>
        <Button
          onPress={this.handleSkipUpload}
          containerStyle={widgetStyles.skipUploadContainer}
          style={widgetStyles.skipUpload}
          textStyle={widgetStyles.skipUploadText}
        >
          SKIP UPLOAD
        </Button>
      </View>
    );
  }
}

export class ImageTable extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.handleFinishSelectImages = this.handleFinishSelectImages.bind(this);
    this.state = { images: {}, error: false };
    const { columns } = this.props;
    for (var i = 0; i < columns.length; i++) {
      this.state.images[columns[i].id] = null;
    }
  }

  handlePress(id) {
    return () => {
      ImagePicker.showImagePicker(this.options, response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          let newImages = Object.assign({}, this.state.images);
          newImages[id] = response.uri;
          this.setState({ images: newImages });
        }
      });
    };
  }

  handleFinishSelectImages() {
    const keys = Object.keys(this.state.images);
    const imageURIs = keys.map(key => this.state.images[key]);
    const imageURILen = imageURIs.length;
    const numberOfNonNullImageURI = imageURIs.filter(i => i !== null).length;
    // n-2 images sent
    if (numberOfNonNullImageURI >= Math.max(imageURILen - 2, 0)) {
      this.setState({ error: false });
      this.props.onFinishSelectImages(this.state.images);
      return;
    }
    this.setState({ error: true });
  }

  render() {
    const { columns } = this.props;
    let i,
      j,
      chunk = 2;
    let rows = [];
    for (i = 0, j = columns.length; i < j; i += chunk) {
      const row = columns.slice(i, i + chunk);
      const rowElements = row.map(r => {
        const imageUri = this.state.images[r.id];
        return (
          <TouchableOpacity
            key={r.id}
            onPress={this.handlePress(r.id)}
            activeOpacity={0.6}
            style={{
              flex: 0.5,
              borderWidth: 1,
              borderColor: colors.softBorderLine,
              backgroundColor: "white"
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingHorizontal: 15,
                paddingVertical: 12
              }}
            >
              <Text style={{ flex: 1, textAlign: "center", marginBottom: 10 }}>
                {r.label}
              </Text>
              {imageUri === null ? (
                <Icon
                  name="add"
                  size={55}
                  style={[
                    widgetStyles.plusIcon,
                    { color: colors.softBorderLine }
                  ]}
                />
              ) : (
                <Image
                  style={{ width: 70, height: 100, resizeMode: "cover" }}
                  source={{ uri: imageUri }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      });
      rows.push(
        <View key={i} style={{ flexDirection: "row" }}>
          {rowElements}
        </View>
      );
    }
    const minImages = Math.max(1, this.props.columns.length - 2);
    const responses = [
      { isValid: false, errMessage: `Must upload at least ${minImages} images` }
    ];
    return (
      <View style={{ marginVertical: 25 }}>
        {rows}
        <Button
          containerStyle={widgetStyles.noBorderRadius}
          onPress={this.handleFinishSelectImages}
          style={[widgetStyles.confirmUpload, widgetStyles.noBorderRadius]}
        >
          UPLOAD IMAGES
        </Button>
        {this.state.error ? <ErrorMessages responses={responses} /> : null}
      </View>
    );
  }
}

export class ClaimPolicyChoice extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: false };
  }

  handleSelectPolicy(policy) {
    this.setState({ disabled: true });
    this.props.onSelectPolicy(policy);
  }

  renderPolicy(policy, idx) {
    const { title } = POLICIES.find(p => p.id === policy.policyType);
    return (
      <TouchableOpacity
        onPress={() => this.handleSelectPolicy.bind(this)(policy)}
        disabled={this.state.disabled}
        key={idx}
      >
        <View
          style={[
            widgetStyles.policyContainer,
            this.state.disabled ? widgetStyles.disabledPolicyChoice : null
          ]}
        >
          <Text style={widgetStyles.policyChoiceName}>{title}</Text>
          <Text style={widgetStyles.policyDetailText}>
            Policy No.: PL{policy.id}
          </Text>
          <Text style={widgetStyles.policyDetailText}>
            Purchase date: {getDateStr(policy.purchaseDate)}
          </Text>
          {policy.coverageSummary.length ? (
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <Text style={{ flex: 0.3 }}>Coverage:</Text>
              <View style={{ flex: 1 }}>
                {policy.coverageSummary.map((coverage, idx) => {
                  return (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text>{coverage.label}</Text>
                      <Text>{coverage.value}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
          <Text style={widgetStyles.policyDetailText}>
            Premium: ${policy.premium}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={widgetStyles.choicesContainer}>
        {database.policies
          .filter(p => p.status === "active")
          .map(this.renderPolicy.bind(this))}
      </View>
    );
  }
}

const CHOICE_SEPARATOR_WIDTH = 2;

export class ChoiceList extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: false };
    this.handlePickChoice = this.handlePickChoice.bind(this);
    this.renderChoice = this.renderChoice.bind(this);
  }

  handlePickChoice(choice) {
    if (this.state.disabled) return;
    this.setState({ disabled: true });
    this.props.onPickChoice(choice.label, choice.value);
  }

  renderChoice(choice, index, choices) {
    const len = choices.length;
    const startStylesOrNull = index === 0 ? widgetStyles.choicesStart : null;
    const endStylesOrNull = index === len - 1 ? widgetStyles.choicesEnd : null;
    const choiceTouchableEnd =
      index === len - 1 ? widgetStyles.choiceTouchableEnd : null;
    return (
      <View
        style={[
          widgetStyles.choiceContainer,
          startStylesOrNull,
          endStylesOrNull
        ]}
        key={choice.value}
      >
        <TouchableHighlight
          style={[widgetStyles.choiceTouchable, choiceTouchableEnd]}
          onPress={() => this.handlePickChoice(choice)}
          activeOpacity={0.6}
          underlayColor={colors.softBorderLine}
        >
          <View style={{ flex: 1 }}>
            <Text style={widgetStyles.choiceText}>{choice.label}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const disabledStyle = this.state.disabled
      ? widgetStyles.disabledChoiceList
      : null;
    return (
      <View style={[widgetStyles.choicesList, disabledStyle]}>
        {this.props.choices.map(this.renderChoice)}
      </View>
    );
  }
}

class ErrorMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      topAnim: new Animated.Value(20)
    };
  }

  componentDidMount() {
    Animated.parallel(
      [
        Animated.timing(this.state.fadeAnim, {
          toValue: 1 // Animate to opacity: 1, or fully opaque
        }),
        Animated.timing(this.state.topAnim, {
          toValue: 0
        })
      ],
      {
        duration: 500
      }
    ).start();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.nonce !== prevProps.nonce) {
    }
  }

  renderError(response, idx) {
    if (response.isValid) return null;
    return (
      <View
        key={idx}
        style={[widgetStyles.errMessage, { alignItems: "center" }]}
      >
        <Text style={widgetStyles.errMessageText}>{response.errMessage}</Text>
      </View>
    );
  }

  render() {
    const { fadeAnim, topAnim } = this.state;
    return (
      <Animated.View
        style={[
          widgetStyles.errContainer,
          { marginHorizontal: 0 },
          { opacity: fadeAnim, top: topAnim }
        ]}
      >
        {this.props.responses.map(this.renderError)}
      </Animated.View>
    );
  }
}

export class MultiInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      responses: [],
      fadeAnim: new Animated.Value(0),
      topAnim: new Animated.Value(20)
    };
    for (var i = 0; i < props.inputs.length; i++) {
      this.state.values.push("");
      this.state.responses.push(new ValidationResult(true, true));
    }
    this.renderInput = this.renderInput.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.responses !== prevState.responses) {
      Animated.parallel(
        [
          Animated.timing(this.state.fadeAnim, {
            toValue: 1 // Animate to opacity: 1, or fully opaque
          }),
          Animated.timing(this.state.topAnim, {
            toValue: 0
          })
        ],
        {
          duration: 500
        }
      ).start();
    }
  }

  handlePickDate(index) {
    return (mode, date) => {
      const values = [].concat(this.state.values);
      values[index] = date;
      this.setState({ values });
    };
  }

  handleSubmit() {
    const inputs = this.state.values.map((value, idx) => ({
      value,
      label: this.props.inputs[idx].label,
      id: this.props.inputs[idx].id
    }));
    const responses = validateAnswer(this.props.question, inputs);
    const allLegit = responses.every(r => r.isValid);
    if (allLegit) {
      this.props.onSubmit(inputs);
      return;
    }
    this.setState({ responses });
  }

  renderInput(input, index, inputs) {
    const len = inputs.length;
    const startStylesOrNull = index === 0 ? widgetStyles.choicesStart : null;
    const endStylesOrNull = index === len - 1 ? widgetStyles.choicesEnd : null;

    const response = this.state.responses[index];

    let inputElement;
    if (
      input.type.indexOf("date") !== -1 ||
      input.type.indexOf("datetime") !== -1
    ) {
      inputElement = (
        <MyDatePicker mode={input.type} onPickDate={this.handlePickDate} />
      );
    } else {
      let keyboardType = "default";
      if (input.type.indexOf("number") !== -1) keyboardType = "numeric";
      if (input.type.indexOf("email") !== -1) keyboardType = "email-address";
      if (input.type.indexOf("") !== -1) keyboardType = "email-address";
      inputElement = (
        <TextInput
          style={widgetStyles.textInput}
          placeholder={input.label}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          onChangeText={text => {
            const values = this.state.values.slice();
            values[index] = text;
            this.setState({ values });
          }}
          value={this.state.values[index]}
        />
      );
    }

    return (
      <View
        key={input.id}
        style={[
          widgetStyles.textInputContainer,
          !response.isValid ? widgetStyles.textInputError : null,
          startStylesOrNull
        ]}
      >
        {inputElement}
      </View>
    );
  }

  renderError(response, idx) {
    if (response.isValid) return null;
    return (
      <View key={idx} style={widgetStyles.errMessage}>
        <Text style={widgetStyles.errMessageText}>{response.errMessage}</Text>
      </View>
    );
  }

  render() {
    let { fadeAnim, topAnim } = this.state;
    return (
      <View style={{ marginBottom: 100 }}>
        <View style={[widgetStyles.choicesList]}>
          {this.props.inputs.map(this.renderInput)}
          <Button
            onPress={this.handleSubmit}
            style={widgetStyles.sendButtonContainer}
          >
            SEND
          </Button>
        </View>
        <Animated.View
          style={[
            widgetStyles.errContainer,
            { opacity: fadeAnim, top: topAnim }
          ]}
        >
          {this.state.responses.map(this.renderError)}
        </Animated.View>
      </View>
    );
  }
}

export class SuggestionList extends Component {
  constructor(props) {
    super(props);
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  renderSuggestion(item) {
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.onSelectSuggestion(item);
        }}
        key={item.value}
      >
        <View style={widgetStyles.suggestionContainer}>
          <Text>{item.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ScrollView
        style={widgetStyles.suggestionListScrollView}
        contentContainerStyle={widgetStyles.suggestionListContainer}
      >
        {this.props.items.map(this.renderSuggestion)}
      </ScrollView>
    );
  }
}

const widgetStyles = StyleSheet.create({
  noBorderRadius: {
    borderRadius: 0
  },
  errContainer: {
    marginLeft: 50,
    marginRight: 60
  },
  errMessageText: {
    color: colors.primaryText
  },
  errMessage: {
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#FFCDD2"
  },
  suggestionListContainer: {
    flexGrow: 1,
    justifyContent: "flex-end"
  },
  suggestionListScrollView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150
  },
  suggestionContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white"
  },
  sendButtonContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderBottomWidth: 0
  },
  textInputContainer: {
    borderBottomWidth: CHOICE_SEPARATOR_WIDTH,
    borderColor: colors.borderLine
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 5
  },
  disabledChoiceList: {
    backgroundColor: colors.softBorderLine
  },
  choicesList: {
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    marginLeft: 50,
    marginRight: 60,
    backgroundColor: "white"
  },
  textInputError: {
    borderWidth: 2,
    borderColor: colors.errorRed
  },
  choiceText: {
    fontSize: 16
  },
  choiceContainer: {},
  choiceTouchable: {
    borderWidth: CHOICE_SEPARATOR_WIDTH,
    borderColor: colors.softBorderLine,
    padding: 15
  },
  choiceTouchableEnd: {},
  choicesStart: {
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15
  },
  choicesEnd: {},
  policyDetailText: {
    marginTop: 7
  },
  policyContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 3
  },
  skipUploadContainer: {
    marginTop: 15
  },
  skipUpload: {
    paddingVertical: 12,
    backgroundColor: "#E0E0E0"
  },
  skipUploadText: {
    color: colors.primaryText,
    fontSize: 15
  },
  disabledPolicyChoice: {
    backgroundColor: colors.softBorderLine
  },
  policyChoiceName: {
    fontSize: 17
  },
  choicesContainer: {
    flex: 1,
    marginTop: 20
  },
  policyChoice: {
    flex: 1,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "white"
  },
  policyPurchaseDate: {
    fontSize: 15
  },
  pickerContainer: Platform.select({
    ios: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: "white"
    },
    android: { flex: 1 }
  }),
  imageGallery: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 20
  },
  imageGalleryTitle: {
    alignSelf: "center",
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center"
  },
  lastImage: {
    marginRight: 0
  },
  emptyImage: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.borderLine
  },
  plusIcon: {
    color: "white"
  },
  pickedImage: {
    width: imageWidth,
    height: imageHeight,
    marginRight: 20,
    borderRadius: 4
  },
  imageGalleryContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "white"
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white"
  },
  actionButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  actionButtonContainer: {
    flex: 1,
    backgroundColor: colors.primaryOrange,
    height: 44
  },
  confirmButtonContainer: {
    marginTop: 5,
    marginBottom: 20
  },
  durationContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 17,
    marginBottom: 22,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 2,
    borderRadius: 3,
    backgroundColor: "white",
    elevation: 4
  }
});
