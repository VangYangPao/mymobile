// @flow
import isEqual from "lodash/isEqual";
import uuid from "uuid";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Platform,
  Alert,
  ToastAndroid,
  Keyboard,
  InteractionManager,
  ActivityIndicator,
  Modal,
  BackHandler
} from "react-native";
import {
  GiftedChat,
  Message,
  Bubble,
  MessageText,
  InputToolbar,
  Composer,
  Send,
  Actions,
  MessageImage
} from "react-native-gifted-chat";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-spinkit";
import Sound from "react-native-sound";
import Fuse from "fuse.js";
import { template } from "lodash";
import { NavigationActions } from "react-navigation";
import Parse from "parse/react-native";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

import { computed, isObservableArray } from "mobx";
import { observer } from "mobx-react";
import AppStore from "../../stores/AppStore";
import { saveNewClaim } from "../parse/claims";
import OverlayModal from "../components/OverlayModal";
import PolicyDetails from "./PolicyDetails";
import { showChatScreenExitWarning } from "../navigations";
import {
  MultiInput,
  MultipleImagePicker,
  ClaimPolicyChoice,
  MyDatePicker,
  CoverageDurationWidget,
  ImageTable,
  ChoiceList,
  SuggestionList,
  PlansTabView,
  TravellerTableInput
} from "../components/chatWidgets";
import TravelPlansView from "../components/TravelPlansView";
// import PlanCarousel from "./PlanCarousel";
// import TravelInsurancePlanCarousel from "./TravelInsurancePlanCarousel";
import { Text } from "../components/defaultComponents";
import PolicyChoice from "../components/PolicyChoice";
const colors = AppStore.colors;
import { validateAnswer } from "../models/validations";
import { ValidationResult } from "../models/base-validations";
import Button from "../components/Button";
import CHAT_STYLES from "../styles/Chat.styles";
import { MESSAGE_LOAD_TIME as _MESSAGE_LOAD_TIME } from "react-native-dotenv";
import { showAlert, crashlyticsLogError } from "../utils";
import MAPPING from "../../data/mappings";
import type {
  QuestionSetType,
  QuestionSetTypeStr,
  PolicyType,
  ChatNavigationState
} from "../../../types";

// Enable playback in silence mode (iOS only)
Sound.setCategory("Playback");

const MESSAGE_LOAD_TIME = parseInt(_MESSAGE_LOAD_TIME, 10);
const POLICIES_FADE_IN_TIME = 400;

const AGENT_USER_ID = 0;
const CUSTOMER_USER_ID = 1;

const AGENT_USER = {
  _id: AGENT_USER_ID,
  name: "Eve",
  avatar: require("../../images/eve-avatar.png")
};
const CUSTOMER_USER = {
  _id: CUSTOMER_USER_ID
};
function transposePolicyChoiceByTitle() {
  let policyDict = {};
  AppStore.policies.forEach(policy => {
    policyDict[policy.title] = policy;
  });
  return policyDict;
}

let loggedIn = false;

export default function ChatScreenWrapper() {
  function wrapper(props: {
    navigation: NavigationScreenProp<ChatNavigationState, *>
  }) {
    const routeParams = props.navigation.state.params;
    const { questionSet, policy, isStartScreen } = routeParams;

    // if (!routeParams && _questionSet === "buy") {
    //   isStartScreen = true;
    // } else if (routeParams && _questionSet === "buy" && !routeParams.policy) {
    //   isStartScreen = true;
    // } else if (
    //   routeParams &&
    //   routeParams.isStartScreen &&
    //   _questionSet === "buy"
    // ) {
    //   isStartScreen = true;
    // } else {
    //   isStartScreen = false;
    // }
    return (
      <ChatScreen
        isStartScreen={isStartScreen}
        questionSet={questionSet}
        policy={policy}
        {...props}
      />
    );
  }

  wrapper.navigationOptions = ({ navigation }) => {
    const { questionSet, isStartScreen } = navigation.state.params;
    let drawerLabel;
    let drawerIcon;
    if (questionSet === "buy") {
      drawerLabel = "Buy Policies";
      drawerIcon = "message";
    } else if (questionSet === "claim") {
      drawerLabel = "Claim Policies";
      drawerIcon = "attach-money";
    }
    return {
      title: isStartScreen ? AppStore.appName : drawerLabel,
      drawerLabel,
      drawerIcon: ({ tintColor }) => (
        <Icon name={drawerIcon} size={22} color={tintColor} />
      )
    };
  };

  return wrapper;
}

const windowDimensions = Dimensions.get("window");
const WINDOW_HEIGHT = windowDimensions.height;
const WINDOW_WIDTH = windowDimensions.width;

type ChatScreenProps = {
  isStartScreen: boolean,
  questionSet: QuestionSetTypeStr,
  policy: PolicyType,
  navigation: NavigationScreenProp<ChatNavigationState, *>
};

@observer
class ChatScreen extends Component {
  questions: QuestionSetType;
  isSkippingQuestion: number => boolean;
  props: ChatScreenProps;
  renderMessage: Object => Message;
  renderMessageImage: Object => Image;
  renderBubble: Object => Bubble;
  renderMessageText: Object => MessageText;
  renderComposer: Object => Button | MyDatePicker | Composer;
  renderSend: Object => Send;
  renderChatFooter: Object => View | SuggestionList;
  renderActions: Object => ?View;
  renderEditButton: () => TouchableOpacity;

  @computed
  get questions() {
    if (this.props.questionSet) {
      return AppStore.questionSets[this.props.questionSet];
    }
  }

  constructor(props: ChatScreenProps) {
    super(props);
    this.state = {
      coverageDuration: null,
      loadingSave: false,
      errLoadingPoliciesMsg: null,
      loadingPolicies: true,
      policies: null,
      currentUser: null,
      idNumberType: "nric",
      renderActionsPicker: true,
      composerText: "",
      keyboardHeight: 0,
      messages: [],
      minInputToolbarHeight: 44,
      answering: true,
      renderInput: true,
      currentQuestionIndex: -1,
      imageProps: [],
      answers: {
        fullName: null,
        planIndex: null
      }
    };
    const initialChatScreenState =
      props.navigation.state.params.chatScreenState;
    if (initialChatScreenState) {
      this.state = initialChatScreenState;
    }
    // if (AppStore.messages.length) {
    //   showAlert("reusing old messages");
    //   this.state.messages = AppStore.messages.slice();
    // }
    AppStore.messages = [];

    this.renderMessage = this.renderMessage.bind(this);
    this.renderMessageImage = this.renderMessageImage.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderMessageText = this.renderMessageText.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderChatFooter = this.renderChatFooter.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.renderEditButton = this.renderEditButton.bind(this);

    this.createMessageObject = this.createMessageObject.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
    this.handleUserSend = this.handleUserSend.bind(this);
    this.handleAgentSend = this.handleAgentSend.bind(this);
    this.handleSelectSuggestion = this.handleSelectSuggestion.bind(this);
    this.handleSelectPolicy = this.handleSelectPolicy.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
    this.handleChangeCoverageDuration = this.handleChangeCoverageDuration.bind(
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
    this.handleTableInputSubmit = this.handleTableInputSubmit.bind(this);
    this.askNextQuestion = this.askNextQuestion.bind(this);
    this.reaskQuestion = this.reaskQuestion.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.handleProceedButtonPress = this.handleProceedButtonPress.bind(this);
    this.handleBackButtonPress = this.handleBackButtonPress.bind(this);
    this.isSkippingQuestion = this.isSkippingQuestion.bind(this);

    this.concatMessageUpdater = message => {
      return prevState => {
        const { currentQuestionIndex } = this.state;
        if (Array.isArray(message)) {
          message = message[0];
        }
        message.questionIndex = currentQuestionIndex;
        return { messages: prevState.messages.concat(message) };
      };
    };

    this.concatMessage = message => {
      this.setState({ messages: this.state.messages.concat(message) });
    };

    this.newMessageSound = new Sound(
      "incoming.mp3",
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          // console.log("failed to load the sound", error);
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
      this.concatMessage({
        type: "policies",
        _id: 1,
        user: AGENT_USER
      });
    };

    const sendFirstMessage = setTimeout(() => {
      const APP_NAME = AppStore.appName;
      this.setState(
        {
          messages: [
            {
              type: "text",
              _id: 0,
              text: `Hello, I'm Eve. Welcome to ${APP_NAME}. I'll be your host and here are the protection plans that may interest you. 😄`,
              createdAt: new Date(),
              user: AGENT_USER
            }
          ]
        },
        () => setTimeout(renderPolicyChoice, POLICIES_FADE_IN_TIME)
      );
    }, MESSAGE_LOAD_TIME);
  }

  handleBackButtonPress() {
    if (this.props.isStartScreen) {
      return false;
    }
    const backAction = () =>
      this.props.navigation.dispatch(NavigationActions.back());
    showChatScreenExitWarning(backAction);
    return true;
  }

  handleEditMessage(messageId: string) {
    const messageIndex = this.state.messages.findIndex(
      m => m._id === messageId
    );
    if (messageIndex === -1) return;
    const message = this.state.messages[messageIndex];
    const { questionIndex: editQuestionIndex } = message;
    const reverseToQuestionIndex = editQuestionIndex - 1;
    const reverseToMessageIndex = this.state.messages.findIndex(
      m => m.questionIndex === reverseToQuestionIndex
    );
    const sliceToMessageIndex = reverseToMessageIndex + 1;
    const messages = this.state.messages.slice(0, sliceToMessageIndex);
    this.setState(
      {
        currentQuestionIndex: editQuestionIndex - 1,
        // renderInput: true,
        // answering: true,
        messages
      },
      this.askNextQuestion
    );
  }

  handleUserSend(messages) {
    this.setState(this.concatMessageUpdater(messages), () => {
      this.setState({ answering: false });
    });
  }

  handleAgentSend(message, cb) {
    const loadingMessage = {
      type: "loading",
      _id: uuid.v4(),
      text: "loading",
      createdAt: new Date(),
      user: AGENT_USER
    };
    let messageIndex;
    const afterLoading = () => {
      InteractionManager.runAfterInteractions(() => {
        const messages = this.state.messages.slice();
        const { currentQuestionIndex } = this.state;
        if (currentQuestionIndex !== -1) {
          const questionIndex = currentQuestionIndex;
          message.questionIndex = questionIndex;
        }
        messages.splice(messageIndex, 1, message);
        this.setState({ renderInput: true, messages: messages }, () => {
          this.playNewMessageSound();
          if (typeof cb === "function") {
            cb();
          }
        });
      });
    };
    this.setState(
      prevState => {
        messageIndex = prevState.messages.length;
        return {
          renderInput: false,
          messages: prevState.messages.concat(loadingMessage)
        };
      },
      () => {
        setTimeout(afterLoading, MESSAGE_LOAD_TIME);
      }
    );
  }

  handleSelectSuggestion(suggestion) {
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `${suggestion.label}`,
        value: suggestion.value,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleSelectPolicy(policyTitle) {
    const policy = transposePolicyChoiceByTitle()[policyTitle];
    const { currentUser } = this.state;
    const params = { policy, page: "info", currentUser };
    this.props.navigation.navigate("Policy", params);
  }

  handleSelectPlan(planIndex) {
    const { title, premium, id } = this.props.policy.plans[planIndex];
    const planMessage = {
      questionIndex: this.state.currentQuestionIndex,
      type: "text",
      _id: uuid.v4(),
      text: `I choose ${title}`,
      value: id,
      user: CUSTOMER_USER
    };
    const { messages } = this.state;
    let newMessages = messages.slice();
    const messagesLen = messages.length;
    newMessages.splice(messagesLen - 1, 1, planMessage);
    this.setState({ messages: newMessages }, () =>
      this.setState({ answering: false, renderInput: true })
    );
  }

  handleChangeCoverageDuration(coverageDuration) {
    this.setState({ coverageDuration });
  }

  handleSelectDuration() {
    const months = this.state.coverageDuration;
    const currentQuestion = this.questions[this.state.currentQuestionIndex];
    if (currentQuestion.id !== "coverageDuration") return;
    const s = months > 1 ? "s" : "";
    this.setState(
      this.concatMessageUpdater({
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
      this.concatMessageUpdater({
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
      this.concatMessageUpdater({
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
      this.concatMessageUpdater({
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
      this.concatMessageUpdater({
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
    const { currentQuestionIndex } = this.state;
    const currentQuestionId = this.questions[currentQuestionIndex].id;
    // const imageLen = Object.keys(images).length;
    const imageLen = images.length;
    const s = imageLen > 1 ? "s" : "";
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: imageLen
          ? `These are the ${imageLen} photo${s} you requested.`
          : "I prefer to skip this",
        value: images,
        user: CUSTOMER_USER
      }),
      () => {
        const imageProps = Object.assign([], this.state.imageProps);
        imageProps.push(currentQuestionId);
        this.setState({ imageProps, answering: false, renderInput: true });
      }
    );
  }

  handleSelectPolicyToClaim(policy) {
    const policyId = policy.get("policyId");
    const policyTypeId = policy.get("policyTypeId");
    const { title } = AppStore.policies.find(p => p.id === policyTypeId);
    let answers = Object.assign(this.state.answers, {
      policyName: title
    });
    this.setState({ answers });

    AppStore.pushClaimQuestionsOfType(policyTypeId);

    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: `I want to claim policy ${title} (${policyId})`,
        value: policyId,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  handleDownload() {
    this.setState(
      this.concatMessageUpdater({
        type: "text",
        _id: uuid.v4(),
        text: "I have printed and filled up, I am ready with the next step.",
        value: true,
        user: CUSTOMER_USER
      }),
      () => this.setState({ answering: false, renderInput: true })
    );
  }

  createMessageObject(message) {
    const { currentQuestionIndex: questionIndex } = this.state;
    return {
      questionIndex,
      type: "text",
      _id: uuid.v4(),
      user: CUSTOMER_USER,
      ...message
    };
  }

  handleTableInputSubmit(items) {
    let { messages } = this.state;
    messages = messages.slice(0, messages.length - 1);
    const message = this.createMessageObject({
      text: "These are the details of my spouse and children",
      value: items
      // multi: true
    });
    messages = messages.concat(message);
    this.setState({ messages }, () =>
      this.setState({ answering: false, renderInput: true })
    );
  }

  handleMultiInputSubmit(inputs) {
    let { messages } = this.state;
    messages = messages.slice(0, messages.length - 1);
    const message = this.createMessageObject({
      text: inputs.map(i => i.value).join(" "),
      value: inputs,
      multi: true
    });
    messages = messages.concat(message);
    this.setState({ messages }, () =>
      this.setState({ answering: false, renderInput: true })
    );
  }

  handleProceedButtonPress() {
    const { questionSet, policy } = this.props;
    if (questionSet === "buy") {
      const { currentUser } = this.state;
      const params = { policy, page: "checkout" };
      // this.props.navigation.navigate("Policy", params);
      let form = Object.assign({}, this.state.answers);
      form.policy = this.props.policy;
      const { planIndex } = form;
      // delete form.policy;
      // delete form.planIndex;
      delete form.icImage;
      if (policy.id === "travel") {
        delete form.price;
      }
      this.props.navigation.navigate("Confirmation", {
        chatScreenState: this.state,
        form,
        currentUser
      });
    } else if (questionSet === "claim") {
      this.setState({ loadingSave: true });
      const purchase = this.state.policies.find(
        p => p.get("policyId") === this.state.answers.claimPolicyNo
      );
      const { currentUser } = this.state;
      const policyTypeId = purchase.get("policyTypeId");
      const navigateToPoliciesAction = NavigationActions.reset({
        key: null,
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "Drawer",
            action: NavigationActions.navigate({
              routeName: "MyPolicies",
              params: {
                currentUser
              }
            })
          })
        ]
      });
      saveNewClaim(
        policyTypeId,
        this.state.answers,
        purchase,
        this.state.imageProps,
        this.state.currentUser
      )
        .then(res => {
          console.log(res);
          showAlert(
            "Your claim has been submitted. You will be notified on this app for updates",
            () => {
              this.setState({ loadingSave: false });
              this.props.screenProps.rootNavigation.dispatch(
                navigateToPoliciesAction
              );
            }
          );
        })
        .catch(err => {
          console.error(err);
          crashlyticsLogError(err);

          this.setState({ loadingSave: false });
          showAlert("Sorry, something went wrong with your claim.", () => {
            this.props.screenProps.rootNavigation.dispatch(
              navigateToPoliciesAction
            );
          });
        });
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonPress
    );

    Parse.User
      .currentAsync()
      .then(currentUser => {
        if (currentUser) {
          let answers = Object.assign({}, this.state.answers);
          const { policy, isStartScreen, questionSet } = this.props;
          answers.firstName = currentUser.get("firstName");
          answers.lastName = currentUser.get("lastName");
          answers.email = currentUser.get("email");
          answers.policy = policy;
          const fullName = answers.firstName + " " + answers.lastName;
          this.setState({ currentUser, answers });
          if (this.props.questionSet === "claim") {
            AppStore.fetchPurchases(Parse, currentUser)
              .find()
              .then(policies => {
                // HACK: To re-render the GiftedChat messages
                const messages = this.state.messages.slice();
                messages[messages.length - 1].dirty = true;
                this.setState({ loadingPolicies: false, policies, messages });
              })
              .catch(err => {
                crashlyticsLogError(err);
                this.setState({
                  loadingPolicies: false,
                  errLoadingPoliciesMsg: err
                });
              });
          }
          const setParamsAction = NavigationActions.setParams({
            params: {
              questionSet: "buy",
              policy,
              isStartScreen,
              currentUser,
              fullName
            },
            key: "Chat"
          });
          // console.log(this.props.navigation.state);
          // this.props.navigation.dispatch(setParamsAction);
          this.props.navigation.setParams({
            questionSet,
            policy,
            isStartScreen,
            currentUser
          });
        }
        if (this.props.isStartScreen) {
          this.renderStartScreenMessages();
        } else {
          // trigger the initial componentDidUpdate
          this.setState({ answering: false });
        }
      })
      .catch(err => {
        console.error(err);
        crashlyticsLogError(err);
      });

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonPress
    );
  }

  _keyboardDidShow(e) {
    const keyboardHeight = e.endCoordinates.height;
    this.setState({ keyboardHeight });
  }

  _keyboardDidHide(e) {
    this.setState({ keyboardHeight: 0 });
  }

  sendNewMessage(msg: { text: string, image?: number }, cb) {
    const { text, image } = msg;
    this.handleAgentSend(
      {
        _id: uuid.v4(),
        type: "text",
        text,
        createdAt: new Date(),
        user: AGENT_USER,
        image
      },
      cb
    );
  }

  reaskQuestion(errMessage) {
    this.sendNewMessage({ text: errMessage });
    this.setState({ answering: true });
  }

  isSkippingQuestion(questionIndex) {
    const question = this.questions[questionIndex];
    let checkAgainst;
    if (this.props.questionSet !== "claim") {
      checkAgainst = this.props.policy.id;
    } else {
      if (this.state.answers.claimPolicyNo) {
        const policy = this.state.policies.find(
          p => p.get("policyId") === this.state.answers.claimPolicyNo
        );
        checkAgainst = policy.get("policyTypeId");
        if (checkAgainst === "pa") {
          const optionId = policy.get("optionId");
          checkAgainst = MAPPING.paOptionIdToName[optionId] || "pa";
        }
        if (question.id !== "accidentType") {
          checkAgainst = this.state.answers.accidentType;
        }
      }
    }
    // skip questions here
    if (
      question.include !== undefined &&
      question.include.indexOf(checkAgainst) === -1
    ) {
      return true;
    }
    if (
      question.exclude !== undefined &&
      question.exclude.indexOf(checkAgainst) !== -1
    ) {
      return true;
    }
    return false;
  }

  askNextQuestion() {
    const currentQuestionIndex = this.state.currentQuestionIndex + 1;

    // end the questionnaire and redirect user to checkout page
    if (currentQuestionIndex >= this.questions.length) {
      return;
    }

    const nextQuestion = this.questions[currentQuestionIndex];
    const isSkippingQuestion = this.isSkippingQuestion(currentQuestionIndex);

    if (isSkippingQuestion) {
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

    const appendWidget = (key, additionalProps, renderInput = false) => {
      Keyboard.dismiss();
      this.setState(
        {
          messages: this.state.messages.concat({
            type: key,
            _id: uuid.v4(),
            user: AGENT_USER,
            ...additionalProps
          })
        },
        () => this.setState({ renderInput })
      );
    };

    const transformOldWidgets = inputs => {
      return inputs.map(input => ({
        label: input.label,
        responseType: input.type,
        id: input.id
      }));
    };

    const handleAppendWidget = () => {
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
        appendWidget("multiInput", { columns: transformOldWidgets(inputs) });
        return;
      }
      if (currentQuestion.id === "planIndex") {
        appendWidget("planIndex", {}, false);
      }
      if (currentQuestion.id === "coverageDuration") {
        appendWidget("coverageDuration", {}, true);
      }

      if (currentQuestion.id === "claimPolicyNo") {
        //her
        appendWidget("claimPolicyNo");
        return;
      }
      const responseTypes = [].concat(
        isObservableArray(currentQuestion.responseType)
          ? currentQuestion.responseType.slice()
          : currentQuestion.responseType
      );
      responseTypes.forEach(type => {
        if (type === "images") appendWidget("images");
        if (type === "choice") {
          appendWidget("choice", { choices: currentQuestion.choices });
        }
        if (type === "imageTable") {
          const { columns } = currentQuestion;
          appendWidget("imageTable", { columns });
        }
        if (type === "multiInput") {
          const { columns } = currentQuestion;
          appendWidget("multiInput", { columns });
        }
        if (type === "table") {
          const { columns } = currentQuestion;
          appendWidget("table", { columns });
        }
        // appendWidget(type, currentQuestion);
      });
    };

    const handleAfterSendMessage = () => {
      this.setState(
        {
          currentQuestionIndex,
          answering: true
        },
        handleAppendWidget
      );
    };

    this.sendNewMessage(
      { text: nextQuestionText, image: nextQuestion.image },
      handleAfterSendMessage
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(this.state.messages, nextState.messages)) {
      AppStore.messages = nextState.messages;
    }
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
      this.setState({ composerText: "" });
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
        let answer =
          lastMessage.value !== undefined
            ? lastMessage.value
            : lastMessage.text.trim();

        if (
          lastQuestion.responseType.indexOf("number") !== -1 &&
          !isNaN(answer) &&
          typeof answer === "string"
        ) {
          answer = parseFloat(answer);
        }

        let validatePromise;
        if (lastMessage.multi) {
          validatePromise = new Promise((resolve, reject) =>
            resolve(new ValidationResult(true, true))
          );
        } else {
          validatePromise = validateAnswer(
            lastQuestion,
            answer,
            this.state.answers
          );
        }

        validatePromise.then(result => {
          if (result.isValid) {
            let newAnswer = {};
            if (lastMessage.multi) {
              answer.forEach(input => {
                newAnswer[input.id] = input.value;
              });
            } else {
              newAnswer[lastQuestion.id] =
                lastMessage.value !== undefined
                  ? lastMessage.value
                  : lastMessage.text;
            }
            const answers = Object.assign(this.state.answers, newAnswer);
            /// setState here
            this.setState({ answers }, this.askNextQuestion);
          } else {
            this.reaskQuestion(result.errMessage);
            return;
          }
        });
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

  renderMessageImage(props) {
    return (
      <Image style={styles.messageImage} source={props.currentMessage.image} />
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
    const { currentQuestionIndex } = this.state;
    let currentQuestion;
    if (currentQuestionIndex >= 0) {
      currentQuestion = this.questions[currentQuestionIndex];
    }
    switch (currentMessage.type) {
      case "claimPolicyNo":
        const { policies } = currentMessage;
        const { currentUser } = this.props.navigation.state.params;
        return (
          <ClaimPolicyChoice
            rootNavigation={this.props.screenProps.rootNavigation}
            currentUser={currentUser}
            loadingPolicies={this.state.loadingPolicies}
            errLoadingPoliciesMsg={this.state.errLoadingPoliciesMsg}
            policies={this.state.policies}
            onSelectPolicy={this.handleSelectPolicyToClaim}
          />
        );
      case "table":
        return (
          <TravellerTableInput
            itemName="traveller"
            navigation={this.props.navigation}
            keyboardHeight={this.state.keyboardHeight}
            question={currentQuestion}
            onSubmit={this.handleTableInputSubmit}
            columns={currentMessage.columns}
          />
        );
      case "multiInput":
        return (
          <MultiInput
            keyboardHeight={this.state.keyboardHeight}
            question={currentQuestion}
            onSubmit={this.handleMultiInputSubmit}
            columns={currentMessage.columns}
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
            <TravelPlansView onSelectPlan={this.handleSelectPlan} />
            // <TravelInsurancePlanCarousel
            //   {...carouselProps}
            //   {...additionalProps}
            //   onSelectPlan={this.handleSelectTravelInsurancePlan}
            // />
          );
        }
        return (
          <PlansTabView
            onSelectPlan={this.handleSelectPlan}
            plans={this.props.policy.plans}
          />
        );
      // return <PlanCarousel {...carouselProps} />;
      case "coverageDuration":
        const notCurrentQuestion =
          this.questions[this.state.currentQuestionIndex].id !==
          "coverageDuration";
        const { planIndex } = this.state.answers;
        const plan = this.props.policy.plans.find(p => p.id === planIndex);
        return (
          <CoverageDurationWidget
            onChangeDuration={this.handleChangeCoverageDuration}
            monthlyPremium={plan.premium}
            disabled={notCurrentQuestion}
          />
        );
      case "text":
      default:
        return <Message {...props} containerStyle={messageContainerStyle} />;
    }
  }

  renderChatFooter() {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0 || !this.state.renderInput) return null;
    const currentQuestion = this.questions[currentQuestionIndex];

    if (currentQuestion.searchChoices) {
      let choices = currentQuestion.choices;
      if (
        this.props.policy.id === "mobile" &&
        this.state.answers.brandID &&
        currentQuestion.id === "modelID"
      ) {
        const { brandID } = this.state.answers;
        choices = currentQuestion.choices[brandID];
      }
      const fuse = new Fuse(choices, currentQuestion.searchOptions);
      const { composerText } = this.state;
      const matchedItems = fuse.search(composerText);
      return (
        <SuggestionList
          searchValue={composerText}
          items={matchedItems}
          onSelectSuggestion={this.handleSelectSuggestion}
        />
      );
    }
    if (currentQuestion.id === "idNumber" && this.state.renderActionsPicker) {
      const choices = [
        { label: "NRIC/FIN", value: "nric" },
        { label: "PASSPORT", value: "passport" }
      ];
      const onSelectChoice = ({ label, value }) => {
        if (value === "nric") {
          this.questions[currentQuestionIndex].responseType = [
            "string",
            "purchaseIdNumber",
            "nric"
          ];
        } else if (value === "passport") {
          this.questions[currentQuestionIndex].responseType = [
            "string",
            "purchaseIdNumber"
          ];
        }
        let answers = Object.assign(this.state.answers);
        answers.idNumberType = value;
        this.setState({
          idNumberType: value,
          answers,
          renderActionsPicker: false
        });
      };

      const suggestionListHeader = (
        <View
          style={{
            borderColor: colors.softBorderLine,
            borderBottomWidth: 1,
            padding: 20,
            backgroundColor: "white"
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Do you hold a Singaporean NRIC/FIN or a Passport?
          </Text>
        </View>
      );
      return (
        <SuggestionList
          headerComponent={suggestionListHeader}
          items={choices}
          onSelectSuggestion={onSelectChoice}
        />
      );
    }
    return null;
  }

  renderComposer(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0) return;
    const currentQuestion = this.questions[currentQuestionIndex];
    let { responseType } = currentQuestion;
    responseType = [].concat(responseType);

    const dateIndex = responseType.indexOf("date");
    const dateTimeIndex = responseType.indexOf("datetime");

    if (currentQuestionIndex >= this.questions.length - 1) {
      return (
        <Button
          onPress={this.handleProceedButtonPress}
          containerStyle={{ flex: 1, borderRadius: 0 }}
          style={{
            borderRadius: 0
          }}
        >
          PROCEED
        </Button>
      );
    }

    // BUG: This causes crash
    // supposed to pass through
    // but tries to render
    // so it crashes
    // HACK: Check if skipping the question first,
    // Then just pass it. If you return null, it will crash too
    if (currentQuestion.id === "coverageDuration") {
      const isSkippingQuestion = this.isSkippingQuestion(currentQuestionIndex);
      if (!isSkippingQuestion) {
        return (
          <Button
            onPress={() => this.handleSelectDuration()}
            containerStyle={{ flex: 1, borderRadius: 0 }}
            style={{
              borderRadius: 0
            }}
          >
            CONFIRM DURATION
          </Button>
        );
      }
    }

    if (dateIndex !== -1 || dateTimeIndex !== -1) {
      let index;
      if (dateIndex !== -1) {
        index = dateIndex;
      } else {
        index = dateTimeIndex;
      }
      const pickerMode = responseType[index];
      let minDateFrom;
      if (currentQuestion.minDateFrom) {
        minDateFrom = this.state.answers[currentQuestion.minDateFrom];
      }

      if (
        !this.state.answering ||
        !this.state.renderInput ||
        this.props.isStartScreen
      ) {
        return <Composer placeholder="Type your message here..." {...props} />;
      }
      const TouchableComponent = props => (
        <TouchableHighlight {...props} accessibilityLabel="chat__datepicker" />
      );
      return (
        <MyDatePicker
          pastOnly={currentQuestion.pastOnly}
          futureOnly={currentQuestion.futureOnly}
          minDate={minDateFrom}
          mode={pickerMode}
          onPickDate={this.handlePickDate}
          TouchableComponent={TouchableComponent}
          customStyles={{
            // dateTouch: { flex: 1 },
            dateIcon: {
              position: "absolute",
              left: 15,
              top: 5,
              marginLeft: 0
            },
            dateInput: { borderWidth: 0, marginLeft: 36 },
            btnTextConfirm: {
              color: colors.primaryAccent
            }
          }}
        />
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
    const handleTextChanged = text => {
      this.setState({ composerText: text }, () => props.onTextChanged(text));
    };
    return (
      <Composer
        placeholder="Type your message here..."
        {...props}
        text={this.state.composerText}
        onTextChanged={handleTextChanged}
        textInputProps={textInputProps}
      />
    );
  }

  renderSend(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0 || !this.state.renderInput) return null;
    const currentQuestion = this.questions[currentQuestionIndex];

    if (!currentQuestion.searchChoices) {
      return <Send {...props} textStyle={styles.sendButton} />;
    }
  }

  renderActions(props) {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 0 || !this.state.renderInput) return null;
    const currentQuestion = this.questions[currentQuestionIndex];

    if (currentQuestion.id === "idNumber") {
      const mapping = {
        nric: "NRIC/FIN",
        passport: "PASSPORT"
      };
      const actionPickerIconType = this.state.renderActionsPicker
        ? "keyboard-arrow-up"
        : "keyboard-arrow-down";
      return (
        <TouchableOpacity
          accessibilityLabel="chat__action-picker"
          onPress={() =>
            this.setState({
              renderActionsPicker: !this.state.renderActionsPicker
            })}
          style={styles.actionPicker}
        >
          <Icon
            style={styles.actionPickerIcon}
            size={20}
            name={actionPickerIconType}
          />
          <Text style={styles.idNumberTypeText}>
            {mapping[this.state.idNumberType]}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  renderEditButton(props) {
    const { user, _id: messageId } = props.currentMessage;
    if (user._id === CUSTOMER_USER_ID) {
      return (
        <TouchableOpacity onPress={() => this.handleEditMessage(messageId)}>
          <View style={styles.editButton}>
            <Icon style={styles.editButtonIcon} name="mode-edit" size={15} />
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    // return <PolicyDetails policy={{ policyTypeId: "pa" }} />;
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
          const supposedScrollHeight =
            contentHeight - WINDOW_HEIGHT * 0.8 + this.state.keyboardHeight;
          scrollHeight = supposedScrollHeight < 0 ? 0 : supposedScrollHeight;
        }
        this.refs.chat._messageContainerRef.scrollTo({
          y: scrollHeight,
          animated: true
        });
      };
    }

    const loadingModal = <OverlayModal loadingText="Submitting claim..." />;

    return (
      <View style={styles.container}>
        {this.state.loadingSave ? loadingModal : null}
        <GiftedChat
          ref="chat"
          messages={this.state.messages /*AppStore.messages.slice()*/}
          onSend={this.handleUserSend}
          user={CUSTOMER_USER}
          onLongPress={() => {}}
          renderActions={this.renderActions}
          renderCustomView={this.renderEditButton}
          renderTime={() => {}}
          renderDay={() => {}}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessage}
          renderMessageImage={this.renderMessageImage}
          renderMessageText={this.renderMessageText}
          renderSend={this.renderSend}
          renderComposer={this.renderComposer}
          renderChatFooter={this.renderChatFooter}
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
  actionPickerIcon: {
    marginLeft: 7,
    marginRight: 3,
    color: colors.primaryAccent
  },
  actionPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: Platform.select({ ios: -5, android: 0 })
  },
  messageImage: {
    width: WINDOW_WIDTH * 0.8,
    height: WINDOW_WIDTH * 0.8,
    marginTop: 10,
    alignSelf: "center",
    resizeMode: "contain"
  },
  editButtonIcon: {
    color: colors.primaryText
  },
  editButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 10
  },
  modalContentContainer: {
    alignItems: "stretch",
    justifyContent: "center",
    width: 100,
    backgroundColor: "white"
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  idNumberTypeText: {
    color: colors.primaryAccent,
    fontSize: 15
  },
  datetimeInput: {},
  datetimeContainer: {
    flex: 1
  },
  spinner: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  ...CHAT_STYLES
});
