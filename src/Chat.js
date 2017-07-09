import uuid from "uuid";
import React, { Component } from "react";
import {
  DatePickerAndroid,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Picker,
  Alert,
  ToastAndroid
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
import { validateAnswer, QUESTION_SETS } from "../data/questions";
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
    title: "microAssure",
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

  render() {
    const now = new Date();
    return (
      <DatePicker
        style={{ flex: 1, paddingHorizontal: 10 }}
        date={now}
        mode="datetime"
        placeholder="SELECT DATE"
        format="YYYY-MM-DD HH:mm"
        maxDate={now}
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
        onDateChange={dateStr => {
          this.props.onPickDate(moment(dateStr).toDate());
        }}
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
    return (
      <TouchableOpacity
        onPress={() => this.handleSelectPolicy.bind(this)(policy)}
        disabled={this.state.disabled}
        key={idx}
      >
        <View
          style={[
            widgetStyles.policyChoice,
            this.state.disabled ? widgetStyles.disabledPolicyChoice : null
          ]}
        >
          <Text style={widgetStyles.policyChoiceName}>{policy.name}</Text>
          <Text>
            Policy No.: PL{policy.id}
          </Text>
          <Text>
            Purchase date: {getDateStr(policy.purchaseDate)}
          </Text>
          <Text>Paid: ${policy.paid}</Text>
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

const imageHeight = 150;
const imageWidth = 100;

const widgetStyles = StyleSheet.create({
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
      answers: { policy: props.policy, planIndex: 0, coverageDuration: 12 }
    };

    if (props.questionSet) {
      this.questions = QUESTION_SETS[props.questionSet];
    }

    this.renderMessage = this.renderMessage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
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
    this.handlePickImage = this.handlePickImage.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
    this.handlePickChoice = this.handlePickChoice.bind(this);
    this.handleSelectPolicyToClaim = this.handleSelectPolicyToClaim.bind(this);
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
                text: "Hi I'm Eve, please choose the insurance plan you prefer. 😄",
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
    const plans = ["Basic", "Enhanced", "Superior", "Premier"];
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
        text: `I choose Plan ${planAlphabet[planIndex]}. $${premium + ""} for ${this.props.policy.from} of protection.`,
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

  handlePickDate(date) {
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        user: CUSTOMER_USER,
        value: date,
        text: `It happened on ${moment(date).format("YYYY-MM-DD HH:mm A")}`
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
      () => this.setState({ answering: false })
    );
  }

  handleFinishSelectImages(imagesUri) {
    const s = imagesUri.length > 1 ? "s" : "";
    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `These are the ${imagesUri.length} photo${s} you requested.`,
        value: imagesUri,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectPolicyToClaim(policy) {
    let answers = Object.assign(this.state.answers, {
      policyName: policy.name
    });
    this.setState({ answers });

    this.setState(
      this.concatMessage({
        type: "text",
        _id: uuid.v4(),
        text: `I want to claim policy ${policy.name} (PL${policy.id})`,
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
          if (policy.title === "Travel Protection") {
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
          const { id, paid, purchaseDate } = policy;
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
    if (
      nextQuestion.include !== undefined &&
      nextQuestion.include.indexOf(this.props.policy.title) === -1
    ) {
      this.setState({ currentQuestionIndex }, this.askNextQuestion);
      return;
    }
    if (
      nextQuestion.exclude !== undefined &&
      nextQuestion.exclude.indexOf(this.props.policy.title) !== -1
    ) {
      this.setState({ currentQuestionIndex }, this.askNextQuestion);
      return;
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
        const currentQuestion = this.questions[this.state.currentQuestionIndex];
        if (currentQuestion.responseType === null) {
          this.askNextQuestion();
          return;
        }
        const widgets = [
          "planIndex",
          "coverageDuration",
          "claimPolicyNo",
          "icImage",
          "claimForm",
          "travelDetails"
        ];
        if (widgets.indexOf(currentQuestion.id) !== -1) {
          this.setState(
            this.concatMessage({
              type: currentQuestion.id,
              _id: uuid.v4(),
              user: AGENT_USER
            }),
            () => this.setState({ renderInput: false })
          );
        }
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
      if (
        currentQuestion.responseType !== null &&
        currentQuestion.responseType.indexOf("choice") !== -1
      ) {
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
        const result = validateAnswer(lastQuestion, answer);

        if (result.isValid) {
          let newAnswer = {};
          newAnswer[lastQuestion.id] = lastMessage.value !== undefined
            ? lastMessage.value
            : lastMessage.text;
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
      case "claimForm":
      case "travelDetails":
      case "icImage":
        return (
          <MultipleImagePicker
            onFinishSelectImages={this.handleFinishSelectImages}
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
            travelDuration
          } = this.state.answers;
          const additionalProps = {
            travelDestination,
            recipient,
            travelDuration
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

  renderInputToolbar(props) {
    if (this.props.isStartScreen) return null;
    const { currentQuestionIndex } = this.state;
    const currentQuestion = this.questions[currentQuestionIndex];
    let { responseType } = currentQuestion;
    responseType = [].concat(responseType);
    if (responseType.indexOf("choice") !== -1 && Platform.OS === "ios") {
      return (
        <PickerActionButton
          label={currentQuestion.label}
          items={currentQuestion.choices}
          onValueChange={this.handlePickChoice}
        />
      );
    }
    return (
      <InputToolbar
        {...props}
        containerStyle={
          !this.state.answering
            ? { backgroundColor: colors.softBorderLine }
            : null
        }
      />
    );
  }

  renderComposer(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0) return;
    const currentQuestion = this.questions[currentQuestionIndex];
    let { responseType } = currentQuestion;
    responseType = [].concat(responseType);

    if (responseType.indexOf("date") !== -1) {
      return <MyDatePicker onPickDate={this.handlePickDate} />;
    } else if (currentQuestion.id === "downloadForm") {
      return (
        <DownloadFormActionButton onDownload={this.handleDownload.bind(this)} />
      );
    } else if (
      responseType.indexOf("choice") !== -1 && Platform.OS === "android"
    ) {
      const label = currentQuestion.id === "recipient"
        ? "SELECT RECIPIENT"
        : "SELECT DESTINATION";
      return (
        <PickerActionButton
          label={label}
          items={currentQuestion.choices}
          onValueChange={this.handlePickChoice}
        />
      );
    }

    let keyboardType = "default";
    if (responseType.indexOf("email") !== -1) keyboardType = "email-address";
    if (responseType.indexOf("number") !== -1) keyboardType = "numeric";
    if (responseType.indexOf("phoneNumber") !== -1) keyboardType = "phone-pad";
    let textInputProps = {
      keyboardType,
      autoFocus: true,
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
    if (currentQuestionIndex >= 0) {
      const currentQuestion = this.questions[currentQuestionIndex];
      if (
        currentQuestion.responseType !== null &&
        currentQuestion.responseType.indexOf("choice") !== -1
      ) {
        minInputToolbarHeight = 200;
      }
    }

    let listViewProps = {};
    if (this.state.currentQuestionIndex > 0) {
      listViewProps.onContentSizeChange = (contentWidth, contentHeight) => {
        if (this._messageContainerRef === null) {
          return;
        }
        let scrollHeight = contentHeight;
        if (Platform.OS === "ios") {
          const supposedScrollHeight =
            contentHeight -
            WINDOW_HEIGHT * 0.8 +
            (minInputToolbarHeight === 200 ? minInputToolbarHeight : 0);
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
          renderInputToolbar={this.renderInputToolbar}
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
