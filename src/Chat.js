import uuid from "uuid";
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
  TextInput
} from "react-native";
import {
  GiftedChat,
  Message,
  Bubble,
  MessageText,
  InputToolbar,
  Composer,
  Send
} from "react-native-gifted-chat";
import moment from "moment";
import RNFetchBlob from "react-native-fetch-blob";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-spinkit";
import Sound from "react-native-sound";
import Slider from "react-native-slider";
import ImagePicker from "react-native-image-picker";
import DatePicker from "react-native-datepicker";
import { template } from "lodash";

import database from "./HackStorage";
import PlanCarousel from "./PlanCarousel";
import TravelInsurancePlanCarousel from "./TravelInsurancePlanCarousel";
import { getDateStr } from "./utils";
import { Text } from "./defaultComponents";
import RangeSlider from "./RangeSlider";
import PolicyChoice from "./PolicyChoice";
import colors from "./colors";
import POLICIES from "../data/policies";
import {
  validateAnswer,
  QUESTION_SETS,
  paClaimQuestions,
  travelClaimQuestions
} from "../data/questions";
import Button from "./Button";

// Enable playback in silence mode (iOS only)
Sound.setCategory("Playback");

const FIRST_MSG_LOAD_TIME = 500;
const POLICIES_FADE_IN_TIME = 400;

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Carol",
  avatar: require("../images/eve.png")
};
const CUSTOMER_USER = {
  _id: CUSTOMER_USER_ID
};
function transposePolicyChoiceByTitle() {
  let policyDict = {};
  POLICIES.forEach(policy => {
    policyDict[policy.title] = policy;
  });
  return policyDict;
}

export default function ChatScreenWrapper(questionSet) {
  const wrapper = props => {
    // have to reassign to _questionSet here
    // solves weird scoping issue where questionSet will remain to be 'buy'
    // when going back in the stack
    let _questionSet = questionSet;
    const routeParams = props.navigation.state.params;
    const isStartScreen = !routeParams && !_questionSet;
    let policy;
    if (routeParams) {
      _questionSet = _questionSet || routeParams.questionSet;
      policy = routeParams.policy;
    }
    return (
      <ChatScreen
        isStartScreen={isStartScreen}
        questionSet={_questionSet}
        policy={policy}
        {...props}
      />
    );
  };

  let drawerLabel;
  let drawerIcon;
  if (!questionSet) {
    drawerLabel = "Buy Policies";
    drawerIcon = "message";
  } else if (questionSet === "claim") {
    drawerLabel = "Claim Policies";
    drawerIcon = "attach-money";
  }
  wrapper.navigationOptions = ({ screenProps }) => ({
    title: "microUmbrella",
    headerTitleStyle: {
      fontWeight: "300"
    },
    drawerLabel,
    drawerIcon: ({ tintColor }) => (
      <Icon name={drawerIcon} size={22} color={tintColor} />
    )
  });
  return wrapper;
}

const BAR_WIDTH = 300;
const BAR_HEIGHT_PERCENT = 0.045;
const SLOT_RADIUS_PERCENT = 0.075;
const SLIDER_RADIUS_PERCENT = 0.15;

class ActionButton extends Component {
  render() {
    return (
      <View style={widgetStyles.actionButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (this.props.onPress) this.props.onPress();
          }}
          activeOpacity={0.5}
        >
          <View style={widgetStyles.actionButton}>
            <Text style={widgetStyles.actionButtonText}>{this.props.text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class DownloadFormActionButton extends Component {
  constructor(props) {
    super(props);
    this.state = { downloading: false };
  }

  handlePress() {
    if (this.state.downloading) {
      return;
    }
    const dirs = RNFetchBlob.fs.dirs;
    const fileId = "0B_YbPr_3tGiPRjFxMThQVVZfX0VGa3JFeXczME1tbTI2OWMw";
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    this.setState({ downloading: true });

    RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
      addAndroidDownloads: {
        useDownloadManager: true,
        mime: "application/pdf",
        mediaScannable: true,
        notification: true
      },
      path: dirs.DocumentDir + "/ClaimsForm.pdf"
    })
      .fetch("GET", downloadUrl)
      .then(res => {
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.openDocument(res.path());
        } else {
          RNFetchBlob.android.actionViewIntent(res.path(), "application/pdf");
        }
        this.props.onDownload();
      });
  }

  render() {
    return (
      <ActionButton
        onPress={this.handlePress.bind(this)}
        text={this.state.downloading ? "DOWNLOADING..." : "DOWNLOAD FORM"}
      />
    );
  }
}

class ImagePickerActionButton extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.options = {
      title: "Select picture of NRIC",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
  }

  handlePress() {
    ImagePicker.showImagePicker(this.options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        if (typeof this.props.onPickImage === "function") {
          this.props.onPickImage(response.uri);
        }
      }
    });
  }

  render() {
    return <ActionButton onPress={this.handlePress} text="SELECT IMAGE" />;
  }
}

class MyDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  onPickDate(dateStr) {
    const date = moment(dateStr).toDate();
    this.setState({ date }, () => this.props.onPickDate(this.props.mode, date));
  }

  render() {
    const now = new Date();
    const mode = this.props.mode || "datetime";
    const allowFuture = this.props.allowFuture || false;
    const format = mode === "datetime" ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
    const maxDate = allowFuture ? null : now;
    return (
      <DatePicker
        style={{ flex: 1, paddingHorizontal: 10 }}
        date={this.state.date}
        mode={mode}
        placeholder="SELECT DATE"
        format={format}
        maxDate={maxDate}
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

class DatePickerActionButton extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  async handlePress() {
    try {
      const today = new Date();
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: today,
        minDate: today,
        mode: "spinner"
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const date = new Date(year, month, day);
        if (typeof this.props.onPickDate === "function")
          this.props.onPickDate(date);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }

  render() {
    return <MyDatePicker />;
  }
}

class PickerActionButton extends Component {
  constructor(props) {
    super(props);
    const labelLengths = this.props.items.map(i => i.label.length);
    this.maxLength = Math.max.apply(null, labelLengths);
  }

  render() {
    return (
      <View style={widgetStyles.pickerContainer}>
        <Picker
          itemStyle={{
            backgroundColor: "white",
            fontSize: this.maxLength > 32 ? 14 : 18
          }}
          onValueChange={(value, index) => {
            if (value === null) return;
            if (typeof this.props.onValueChange === "function") {
              const item = this.props.items[index - 1];
              this.props.onValueChange(item.label, item.value);
            }
          }}
        >
          {[{ label: this.props.label, value: null }]
            .concat(this.props.items)
            .map(item => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
        </Picker>
      </View>
    );
  }
}

class CoverageDurationWidget extends Component {
  constructor(props) {
    super(props);
    this.coverageDurations = [1, 2, 3, 6, 12];
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

class MultipleImagePicker extends Component {
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

class ImageTable extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.state = { images: {} };
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

  render() {
    const { columns } = this.props;
    let i, j, chunk = 2;
    let rows = [];
    for ((i = 0), (j = columns.length); i < j; i += chunk) {
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
              {imageUri === null
                ? <Icon
                    name="add"
                    size={55}
                    style={[
                      widgetStyles.plusIcon,
                      { color: colors.softBorderLine }
                    ]}
                  />
                : <Image
                    style={{ width: 70, height: 100, resizeMode: "cover" }}
                    source={{ uri: imageUri }}
                  />}
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
    return (
      <View style={{ marginVertical: 25 }}>
        {rows}
        <Button
          onPress={() => this.props.onFinishSelectImages(this.state.images)}
          style={widgetStyles.confirmUpload}
        >
          UPLOAD IMAGES
        </Button>
      </View>
    );
  }
}

class ClaimPolicyChoice extends Component {
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
          <Text style={widgetStyles.policyDetailText}>
            Paid: ${policy.paid}
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

class ChoiceList extends Component {
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
    return (
      <TouchableHighlight
        onPress={() => this.handlePickChoice(choice)}
        style={[
          widgetStyles.choiceTouchable,
          startStylesOrNull,
          endStylesOrNull
        ]}
        activeOpacity={0.6}
        underlayColor={colors.softBorderLine}
        key={choice.value}
      >
        <View style={[startStylesOrNull, endStylesOrNull]}>
          <Text style={widgetStyles.choiceText}>{choice.label}</Text>
        </View>
      </TouchableHighlight>
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

class MultiInput extends Component {
  constructor(props) {
    super(props);
    this.state = { values: [] };
    for (var i = 0; i < props.inputs.length; i++) {
      this.state.values.push("");
    }
    this.renderInput = this.renderInput.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      id: this.props.inputs[idx].id
    }));
    this.props.onSubmit(inputs);
  }

  renderInput(input, index, inputs) {
    const len = inputs.length;
    const startStylesOrNull = index === 0 ? widgetStyles.choicesStart : null;
    const endStylesOrNull = index === len - 1 ? widgetStyles.choicesEnd : null;

    let inputElement;
    if (
      input.type.indexOf("date") !== -1 || input.type.indexOf("datetime") !== -1
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
        style={[widgetStyles.textInputContainer, startStylesOrNull]}
      >
        {inputElement}
      </View>
    );
  }

  render() {
    return (
      <View style={[widgetStyles.choicesList, { marginBottom: 100 }]}>
        {this.props.inputs.map(this.renderInput)}
        <Button
          onPress={this.handleSubmit}
          style={widgetStyles.sendButtonContainer}
        >
          SEND
        </Button>
      </View>
    );
  }
}

const imageHeight = 150;
const imageWidth = 100;

const widgetStyles = StyleSheet.create({
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
    borderRadius: 15,
    marginLeft: 50,
    marginRight: 60,
    marginBottom: 50,
    borderColor: colors.borderLine,
    borderWidth: CHOICE_SEPARATOR_WIDTH,
    backgroundColor: "white"
  },
  choiceText: {
    fontSize: 16
  },
  choiceTouchable: {
    padding: 15,
    borderBottomWidth: CHOICE_SEPARATOR_WIDTH,
    borderColor: colors.borderLine
  },
  choicesStart: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  choicesEnd: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomWidth: 0
  },
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

const WINDOW_HEIGHT = Dimensions.get("window").height;

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      minInputToolbarHeight: 44,
      answering: true,
      renderInput: true,
      currentQuestionIndex: -1,
      answers: {
        fullName: "Denzel Tan",
        policy: props.policy,
        planIndex: 0,
        coverageDuration: 12
      }
    };

    if (props.questionSet) {
      this.questions = QUESTION_SETS[props.questionSet];
    }

    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);

    this.handleUserSend = this.handleUserSend.bind(this);
    this.handleAgentSend = this.handleAgentSend.bind(this);
    this.handleSelectPolicy = this.handleSelectPolicy.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.handleSelectTravelInsurancePlan = this.handleSelectTravelInsurancePlan.bind(
      this
    );
    this.handleSelectDuration = this.handleSelectDuration.bind(this);
    this.handleFinishSelectImages = this.handleFinishSelectImages.bind(this);
    this.handleFinishImageTable = this.handleFinishImageTable.bind(this);
    this.handlePickImage = this.handlePickImage.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
    this.handlePickChoice = this.handlePickChoice.bind(this);
    this.handleSelectPolicyToClaim = this.handleSelectPolicyToClaim.bind(this);
    this.handleMultiInputSubmit = this.handleMultiInputSubmit.bind(this);
    this.renderStartScreenMessages = this.renderStartScreenMessages.bind(this);
    this.askNextQuestion = this.askNextQuestion.bind(this);
    this.reaskQuestion = this.reaskQuestion.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);

    this.concatMessage = message => {
      return prevState => {
        return { messages: prevState.messages.concat(message) };
      };
    };

    this.newMessageSound = new Sound(
      "incoming.mp3",
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        this.newMessageSound.setVolume(0.75);
      }
    );

    this.playNewMessageSound = () => {
      this.newMessageSound.play(success => {
        if (success) {
        } else {
        }
      });
    };
  }

  renderStartScreenMessages() {
    this.setState({
      messages: [
        {
          type: "loading",
          _id: 0,
          text: "loading",
          createdAt: new Date(),
          user: AGENT_USER
        }
      ]
    });

    const renderPolicyChoice = () => {
      this.handleAgentSend({ type: "policies", _id: 1, user: AGENT_USER });
    };

    setTimeout(() => {
      this.setState(
        prevState => {
          return {
            messages: [
              {
                type: "text",
                _id: 0,
                text: "Hello, I'm Eve. Welcome to microUmbrella. I'll be your host and here are the protection plans that may interest you. 😄",
                createdAt: new Date(),
                user: AGENT_USER
              }
            ]
          };
        },
        () => setTimeout(renderPolicyChoice, POLICIES_FADE_IN_TIME)
      );
    }, FIRST_MSG_LOAD_TIME);
  }

  handleUserSend(messages) {
    this.setState(this.concatMessage(messages), () => {
      this.setState({ answering: false });
    });
  }

  handleAgentSend(message) {
    this.setState(this.concatMessage(message), this.playNewMessageSound);
  }

  handleSelectPolicy(policyTitle) {
    const policy = transposePolicyChoiceByTitle()[policyTitle];
    const params = { policy, page: "info" };
    this.props.navigation.navigate("Policy", params);
  }

  handleSelectTravelInsurancePlan(planIndex, price) {
    const plans = ["Basic", "Enhanced", "Superior"];
    const answers = Object.assign(this.state.answers, { price });
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `${plans[planIndex]} plan`,
        value: planIndex,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true, answers })
    );
  }

  handleSelectPlan(planIndex) {
    const planAlphabet = ["A", "B", "C", "D", "E"];
    const premium = this.props.policy.plans[planIndex].premium;
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `I choose Plan ${planAlphabet[planIndex]}`,
        value: planIndex,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectDuration(months) {
    const currentQuestion = this.questions[this.state.currentQuestionIndex];
    if (currentQuestion.id !== "coverageDuration") return;
    const s = months > 1 ? "s" : "";
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `I want to be covered for ${months} month${s}`,
        value: months,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handlePickDate(mode, date) {
    const format = mode === "datetime" ? "YYYY-MM-DD HH:mm A" : "YYYY-MM-DD";
    const dateStr = moment(date).format(format);
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: date,
        text: `${dateStr}`
      }),
      () => this.setState({ answering: false })
    );
  }

  handlePickImage(imageUri) {
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: imageUri,
        image: imageUri
      }),
      () => this.setState({ answering: false })
    );
  }

  handlePickChoice(label, value) {
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value,
        text: label
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleFinishSelectImages(imagesUri) {
    const s = imagesUri.length > 1 ? "s" : "";
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: imagesUri.length
          ? `These are the ${imagesUri.length} photo${s} you requested.`
          : "I prefer to skip this",
        value: imagesUri,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleFinishImageTable(images) {
    const imageLen = Object.keys(images).length;
    const s = imageLen > 1 ? "s" : "";
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: imageLen
          ? `These are the ${imageLen} photo${s} you requested.`
          : "I prefer to skip this",
        value: images,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectPolicyToClaim(policy) {
    const { title } = POLICIES.find(p => p.id === policy.policyType);
    let answers = Object.assign(this.state.answers, {
      policyName: title
    });
    this.setState({ answers });

    if (policy.policyType.indexOf("pa") !== -1) {
      this.questions.push.apply(this.questions, paClaimQuestions);
    } else if (policy.policyType.indexOf("travel") !== -1) {
      this.questions.push.apply(this.questions, travelClaimQuestions);
    }

    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `I want to claim policy ${title} (PL${policy.id})`,
        value: policy.id,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleDownload() {
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: "I have printed and filled up, I am ready with the next step.",
        value: true,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleMultiInputSubmit(inputs) {
    let { messages } = this.state;
    messages = messages.slice(0, messages.length - 1);
    messages = messages.concat({
      type: "text",
      _id: uuid.v4(),
      text: inputs.map(i => i.value).join(" "),
      value: inputs,
      user: CUSTOMER_USER,
      multi: true
    });
    this.setState({ messages }, () =>
      this.setState({ answering: false, renderInput: true })
    );
  }

  componentDidMount() {
    if (this.props.isStartScreen) {
      this.renderStartScreenMessages();
    } else {
      // trigger the initial componentDidUpdate
      this.setState({ answering: false });
    }
  }

  sendNewMessage(msgText) {
    this.handleAgentSend({
      _id: uuid.v4(),
      type: "text",
      text: msgText,
      createdAt: new Date(),
      user: AGENT_USER
    });
  }

  reaskQuestion(errMessage) {
    this.sendNewMessage(errMessage);
    this.setState({ answering: true });
  }

  askNextQuestion() {
    const currentQuestionIndex = this.state.currentQuestionIndex + 1;

    // end the questionnaire and redirect user to checkout page
    if (currentQuestionIndex >= this.questions.length) {
      const { questionSet, policy } = this.props;
      setTimeout(() => {
        if (questionSet === "buy") {
          const params = { policy, page: "checkout" };
          // this.props.navigation.navigate("Policy", params);
          let form = Object.assign({}, this.state.answers);
          const { planIndex } = form;
          delete form.policy;
          delete form.planIndex;
          delete form.icImage;
          if (policy.id === "travel") {
            form.totalPremium = new Number(form.price);
            delete form.price;
          } else {
            form.totalPremium =
              this.props.policy.plans[planIndex].premium *
              form.coverageDuration;
          }
          this.props.navigation.navigate("Confirmation", { form });
        } else if (questionSet === "claim") {
          const policyIndex = database.policies.findIndex(
            p => p.id === this.state.answers.claimPolicyNo
          );
          const policy = database.policies[policyIndex];
          const { id, paid, policyType, purchaseDate } = policy;
          database.claims.push({
            id,
            paid,
            purchaseDate,
            status: "pending",
            amount: 1000
          });
          database.policies.splice(policyIndex, 1);
          if (Platform.OS === "ios") {
            Alert.alert("Thank you!", "Your claim has been submitted.", [
              {
                text: "OK",
                onPress: () => this.props.navigation.navigate("Status")
              }
            ]);
          } else {
            ToastAndroid.show(
              "Thank you! Your claim has been submitted.",
              ToastAndroid.LONG
            );
            this.props.navigation.navigate("Status");
          }
        }
      }, 2000);
      return;
    }

    const nextQuestion = this.questions[currentQuestionIndex];
    let checkAgainst;
    if (this.props.questionSet !== "claim") {
      checkAgainst = this.props.policy.id;
    } else {
      if (this.state.answers.claimPolicyNo) {
        const policy = database.policies.find(
          p => p.id === this.state.answers.claimPolicyNo
        );
        checkAgainst = policy.policyType;
        if (nextQuestion.id !== "claimType") {
          checkAgainst = this.state.answers.claimType;
        }
      }
    }
    // skip questions here
    if (
      nextQuestion.include !== undefined &&
      nextQuestion.include.indexOf(checkAgainst) === -1
    ) {
      this.setState({ currentQuestionIndex }, this.askNextQuestion);
      return;
    }
    if (
      nextQuestion.exclude !== undefined &&
      nextQuestion.exclude.indexOf(checkAgainst) !== -1
    ) {
      this.setState({ currentQuestionIndex }, this.askNextQuestion);
      return;
    }
    // eval only when needed
    if (nextQuestion.condition) {
      if (!eval(nextQuestion.condition)) {
        // condition is not met
        this.setState({ currentQuestionIndex }, this.askNextQuestion);
        return;
      }
    }

    const nextQuestionText = template(nextQuestion.question)(
      this.state.answers
    );
    this.sendNewMessage(nextQuestionText);

    this.setState(
      {
        currentQuestionIndex,
        answering: true
      },
      () => {
        const appendWidget = (key, additionalProps) =>
          this.setState(
            this.concatMessage({
              type: key,
              _id: uuid.v4(),
              user: AGENT_USER,
              ...additionalProps
            }),
            () => this.setState({ renderInput: false })
          );
        const currentQuestion = this.questions[this.state.currentQuestionIndex];
        if (currentQuestion.responseType === null) {
          this.askNextQuestion();
          return;
        }
        if (currentQuestion.id instanceof Array) {
          const inputs = currentQuestion.id.map((id, idx) => ({
            id,
            type: currentQuestion.responseType[idx],
            label: currentQuestion.labels[idx]
          }));
          appendWidget("multiInput", { inputs });
          return;
        }
        const widgets = [
          "planIndex",
          "coverageDuration",
          "claimPolicyNo"
          // "travelDetails"
        ];
        const typeWidgets = ["images", "imageTable", "choice"];
        if (widgets.indexOf(currentQuestion.id) !== -1) {
          appendWidget(currentQuestion.id);
        }
        const responseTypes = [].concat(currentQuestion.responseType);
        responseTypes.forEach(type => {
          if (type === "images") appendWidget("images");
          if (type === "choice") {
            appendWidget("choice", { choices: currentQuestion.choices });
          }
          if (type === "imageTable") {
            const { columns } = currentQuestion;
            appendWidget("imageTable", { columns });
          }
          // appendWidget(type, currentQuestion);
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentQuestionIndex } = this.state;
    if (
      prevState.answering !== this.state.answering ||
      prevState.renderInput !== this.state.renderInput
    ) {
      this.refs.chat.resetInputToolbar();
    }
    if (currentQuestionIndex >= 0) {
      const currentQuestion = this.questions[currentQuestionIndex];
      if (currentQuestion.responseType !== null) {
        this.refs.chat.resetInputToolbar();
      }
    }

    if (this.state.answering !== prevState.answering && !this.state.answering) {
      const { messages } = this.state;

      // skip validation for bootstrap step-0
      if (messages.length === 0) {
        this.askNextQuestion();
      } else {
        const lastMessage = messages[messages.length - 1];
        const lastQuestion = this.questions[currentQuestionIndex];

        // just ignore checking the response if null
        if (lastQuestion.responseType === null) {
          return;
        }
        let answer = lastMessage.value !== undefined
          ? lastMessage.value
          : lastMessage.text.trim();

        if (
          lastQuestion.responseType.indexOf("number") !== -1 &&
          !isNaN(answer) &&
          typeof answer === "string"
        ) {
          answer = parseFloat(answer);
        }
        console.log(answer);
        const result = validateAnswer(lastQuestion, answer);

        if (result.isValid) {
          let newAnswer = {};
          if (lastMessage.multi) {
            answer.forEach(input => {
              newAnswer[input.id] = input.value;
            });
          } else {
            newAnswer[lastQuestion.id] = lastMessage.value !== undefined
              ? lastMessage.value
              : lastMessage.text;
          }
          const answers = Object.assign(this.state.answers, newAnswer);
          this.setState({ answers }, this.askNextQuestion);
        } else {
          this.reaskQuestion(result.errMessage);
          return;
        }
      }
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: StyleSheet.flatten(styles.bubbleLeft),
          right: StyleSheet.flatten(styles.bubbleRight)
        }}
      />
    );
  }

  renderMessageText(props) {
    if (props.currentMessage.type === "loading") {
      return (
        <Spinner style={styles.spinner} color="white" type="ThreeBounce" />
      );
    }
    return (
      <MessageText
        {...props}
        textStyle={{
          left: StyleSheet.flatten(styles.messageTextLeft),
          right: StyleSheet.flatten(styles.messageTextRight)
        }}
        linkStyle={{
          left: StyleSheet.flatten(styles.messageTextLeft),
          right: StyleSheet.flatten(styles.messageTextRight)
        }}
      />
    );
  }

  renderMessage(props) {
    const { currentMessage } = props;
    switch (currentMessage.type) {
      case "claimPolicyNo":
        return (
          <ClaimPolicyChoice onSelectPolicy={this.handleSelectPolicyToClaim} />
        );
      case "multiInput":
        return (
          <MultiInput
            onSubmit={this.handleMultiInputSubmit}
            inputs={currentMessage.inputs}
          />
        );
      case "choice":
        return (
          <ChoiceList
            choices={currentMessage.choices}
            onPickChoice={this.handlePickChoice}
          />
        );
      case "images":
        return (
          <MultipleImagePicker
            onFinishSelectImages={this.handleFinishSelectImages}
          />
        );
      case "imageTable":
        return (
          <ImageTable
            columns={currentMessage.columns}
            onFinishSelectImages={this.handleFinishImageTable}
          />
        );
      case "policies":
        return <PolicyChoice onSelectPolicy={this.handleSelectPolicy} />;
      case "planIndex":
        const carouselProps = {
          onSelectPlan: this.handleSelectPlan,
          plans: this.props.policy.plans
        };
        if (this.props.policy.isTravelInsurance) {
          const {
            travelDestination,
            recipient,
            departureDate,
            returnDate
          } = this.state.answers;
          var days =
            Math.abs(returnDate - departureDate) / (1000 * 60 * 60 * 24);
          const additionalProps = {
            travelDestination,
            recipient,
            travelDuration: days
          };
          return (
            <TravelInsurancePlanCarousel
              {...carouselProps}
              {...additionalProps}
              onSelectPlan={this.handleSelectTravelInsurancePlan}
            />
          );
        }
        return <PlanCarousel {...carouselProps} />;
      case "coverageDuration":
        const notCurrentQuestion =
          this.questions[this.state.currentQuestionIndex].id !==
          "coverageDuration";
        const { planIndex } = this.state.answers;
        return (
          <CoverageDurationWidget
            onSelectDuration={this.handleSelectDuration}
            monthlyPremium={this.props.policy.plans[planIndex].premium}
            disabled={notCurrentQuestion}
          />
        );
      case "text":
      default:
        return <Message {...props} containerStyle={messageContainerStyle} />;
    }
  }

  renderComposer(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0) return;
    const currentQuestion = this.questions[currentQuestionIndex];
    let { responseType } = currentQuestion;
    responseType = [].concat(responseType);

    if (responseType.indexOf("date") !== -1) {
      return (
        <MyDatePicker
          allowFuture={currentQuestion.allowFuture}
          mode="date"
          onPickDate={this.handlePickDate}
        />
      );
    } else if (responseType.indexOf("datetime") !== -1) {
      return (
        <MyDatePicker
          allowFuture={currentQuestion.allowFuture}
          mode="datetime"
          onPickDate={this.handlePickDate}
        />
      );
    } else if (currentQuestion.id === "downloadForm") {
      return (
        <DownloadFormActionButton onDownload={this.handleDownload.bind(this)} />
      );
    }

    let keyboardType = "default";
    if (responseType.indexOf("email") !== -1) keyboardType = "email-address";
    if (responseType.indexOf("number") !== -1) keyboardType = "numeric";
    if (responseType.indexOf("phoneNumber") !== -1) keyboardType = "phone-pad";
    let textInputProps = {
      keyboardType,
      autoCorrect: false,
      autoCapitalize: "none"
    };
    return (
      <Composer
        placeholder="Type your message here..."
        {...props}
        textInputProps={textInputProps}
      />
    );
  }

  renderSend(props) {
    return <Send {...props} textStyle={styles.sendButton} />;
  }

  render() {
    const additionalProps = {};
    let minInputToolbarHeight = 44;
    if (
      !this.state.answering ||
      !this.state.renderInput ||
      this.props.isStartScreen
    ) {
      minInputToolbarHeight = 0;
    }
    const { currentQuestionIndex } = this.state;

    let listViewProps = {};
    if (this.state.currentQuestionIndex > 0) {
      listViewProps.onContentSizeChange = (contentWidth, contentHeight) => {
        if (this._messageContainerRef === null) {
          return;
        }
        let scrollHeight = contentHeight;
        if (Platform.OS === "ios") {
          const supposedScrollHeight = contentHeight - WINDOW_HEIGHT * 0.8;
          scrollHeight = supposedScrollHeight < 0 ? 0 : supposedScrollHeight;
        }
        this.refs.chat._messageContainerRef.scrollTo({
          y: scrollHeight,
          animated: true
        });
      };
    }

    return (
      <View style={styles.container}>
        <GiftedChat
          ref="chat"
          messages={this.state.messages}
          onSend={this.handleUserSend}
          user={CUSTOMER_USER}
          onLongPress={() => {}}
          renderTime={() => {}}
          renderDay={() => {}}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageText={this.renderMessageText}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          minInputToolbarHeight={minInputToolbarHeight}
          listViewProps={listViewProps}
        />
      </View>
    );
  }
}

const messageContainerStyle = {
  left: {
    alignItems: "flex-start"
  },
  right: {
    alignItems: "flex-start"
  }
};

const styles = StyleSheet.create({
  datetimeInput: {},
  datetimeContainer: {
    flex: 1
  },
  textInput: {
    backgroundColor: colors.softBorderLine
  },
  sendButton: {
    color: colors.primaryOrange
  },
  bubbleLeft: {
    backgroundColor: colors.primaryOrange
  },
  messageTextLeft: {
    textDecorationLine: "none",
    color: "white"
  },
  bubbleRight: {
    backgroundColor: "white"
  },
  messageTextRight: {
    textDecorationLine: "none",
    color: colors.primaryText
  },
  spinner: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  container: {
    flex: 1,
    paddingTop: 12
  }
});
