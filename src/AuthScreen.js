// @flow
import uuid from "uuid";
import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Picker,
  ScrollView,
  InteractionManager,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { NavigationActions } from "react-navigation";
import VectorDrawableView from "./VectorDrawableView";
import Parse from "parse/react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import t from "tcomb-form-native";
const Form = t.form.Form;

import colors from "./colors";
import Button from "./Button";
import { generateID, showAlert } from "./utils";
import { Text } from "./defaultComponents";

let formStyles = Object.assign({}, t.form.Form.stylesheet);
formStyles.controlLabel.normal.color = "white";
formStyles.controlLabel.normal.backgroundColor = "transparent";
formStyles.textbox.normal.borderColor = "white";
formStyles.textbox.normal.color = "white";
formStyles.fieldset.marginTop = 20;
formStyles.fieldset.marginBottom = 10;

const createResetAction = (policy, currentUser) => {
  return NavigationActions.reset({
    index: 1,
    key: "Chat",
    actions: [
      NavigationActions.navigate({
        routeName: "Chat",
        params: {
          isStartScreen: true,
          questionSet: "buy",
          policy: null,
          currentUser
        }
      })
      // NavigationActions.navigate({
      //   routeName: "Chat",
      //   params: {
      //     isStartScreen: false,
      //     questionSet: "claim",
      //     policy,
      //     currentUser
      //   }
      // })
    ]
  });
};

function mysubtype(type, getValidationErrorMessage, name) {
  var Subtype = t.refinement(
    type,
    function(x) {
      if (!x.length) {
        return;
      }
      return !t.String.is(getValidationErrorMessage(x));
    },
    name
  );
  Subtype.getValidationErrorMessage = getValidationErrorMessage;
  return Subtype;
}

var EmailType = mysubtype(t.String, function(s) {
  if (!s) return "Email must not be empty";
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(s);
  if (!isValid) {
    return "Email is not in valid format, e.g. hello@microumbrella.com";
  }
});

const PasswordType = mysubtype(t.String, p => {
  if (!p) return "Password must not be empty";
  if (p.length < 8) {
    return "Password must be at least 8 characters long";
  }

  let hasNumeric = false;
  let hasAlpha = false;

  for (i = 0, len = p.length; i < len; i++) {
    code = p.charCodeAt(i);
    if (code > 47 && code < 58) {
      hasNumeric = true;
    } else if (code > 64 && code < 91) {
      hasAlpha = true;
    } else if (code > 96 && code < 123) {
      hasAlpha = true;
    }
  }

  if (!hasAlpha || !hasNumeric) {
    return "Password must have numbers (0-9) and alphabets (A-Z)";
  }
});

let userTypedPassword = "";

const ConfirmPasswordType = mysubtype(t.String, p => {
  if (!p) return "Password must not be empty";
  if (p !== userTypedPassword) {
    return "Passwords must match";
  }
});

const PhoneType = mysubtype(t.String, p => {
  if (!p) return "Phone number must not be empty";
  const hasEightOrNine = p[0] === "8" || p[0] === "9";
  if (!hasEightOrNine) {
    return "Phone number must begin with 8 or 9";
  }
});

const NonEmptyStr = mysubtype(t.String, p => {
  if (!p) return "Full name must not be empty";
});

const UserSignUp = t.struct({
  email: EmailType,
  firstName: NonEmptyStr,
  lastName: NonEmptyStr,
  telephone: PhoneType,
  password: PasswordType,
  confirmPassword: ConfirmPasswordType
});
const userSignUpOptions = {
  auto: "placeholders",
  fields: {
    email: {
      placeholderTextColor: "white",
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoCorrect: false
    },
    firstName: {
      placeholderTextColor: "white",
      error: "Name cannot be empty"
    },
    lastName: {
      placeholderTextColor: "white",
      error: "Name cannot be empty"
    },
    telephone: {
      placeholderTextColor: "white",
      keyboardType: "phone-pad"
    },
    password: {
      secureTextEntry: true,
      placeholderTextColor: "white"
    },
    confirmPassword: {
      secureTextEntry: true,
      placeholderTextColor: "white"
    }
  }
};

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.acceptTOS = false;
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp() {
    const formValues = this.form.getValue();
    if (formValues) {
      // if (!this.acceptTOS) {
      //   showAlert(
      //     "You have to agree with the Terms of Use and Privacy Policy."
      //   );
      //   return;
      // }
      this.props.onSignUp(formValues).catch(err => {
        if (err.code) {
          showAlert(err.message);
        }
      });
    }
  }

  handleFormChange(form) {
    if (form.password) {
      userTypedPassword = form.password;
    }
  }

  render() {
    return (
      <View>
        <KeyboardAwareScrollView extraScrollHeight={75}>
          <View style={styles.container}>
            <View style={{ marginTop: 30, justifyContent: "center" }}>
              <Text style={styles.signUpHeader}>Sign up for microUmbrella</Text>
            </View>
            <View style={{ flex: 0.1, justifyContent: "center" }}>
              <Form
                ref={form => (this.form = form)}
                type={UserSignUp}
                options={userSignUpOptions}
                onChange={this.handleFormChange}
              />
            </View>
            {/*<View style={styles.textContainer}>
              <Text style={styles.textContainerText}>
                I have read, understood and agreed to the
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("TermsOfUse")}
              >
                <Text style={[styles.textContainerText, styles.touchableText]}>
                  Terms of Use
                </Text>
              </TouchableOpacity>
              <Text style={styles.textContainerText}> and </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
              >
                <Text style={[styles.textContainerText, styles.touchableText]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <Text style={styles.textContainerText}>.</Text>
            </View>
            <Switch
              ref={tosSwitch => (this.tosSwitch = tosSwitch)}
              onValueChange={val => {
                // WTF HACK: setState re-renders Form component attached by ref
                // so you do setNativeProps manually
                this.acceptTOS = val;
                this.tosSwitch._rctSwitch.setNativeProps({ value: val });
              }}
              value={false}
              onTintColor={colors.tertiaryGreen}
              style={styles.tosSwitch}
            />*/}
            <View>
              <Button
                accessibilityLabel="auth__signup-btn"
                onPress={this.handleSignUp}
                style={styles.signinButton}
              >
                <View style={styles.signinButtonContainer}>
                  <Text style={styles.signinButtonText}>SIGN UP</Text>
                  {this.state.loading ? (
                    <ActivityIndicator
                      style={{ marginLeft: 10 }}
                      color="white"
                    />
                  ) : null}
                </View>
              </Button>
              <TouchableOpacity
                onPress={this.props.onNavigateToLogin}
                style={{ marginTop: 20 }}
                activeOpacity={0.5}
              >
                <Text style={[styles.bottomBtn, { marginTop: 10 }]}>
                  Already a member? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const UserLogin = t.struct({
  email: EmailType,
  password: t.String
});
const userLoginOptions = {
  fields: {
    email: {
      autoCapitalize: "none",
      autoCorrect: false,
      keyboardType: "email-address",
      error: "Enter a valid email"
    },
    password: {
      secureTextEntry: true,
      error: "Password must not be empty"
    }
  }
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const formValues = this.refs.form.getValue();
    if (formValues) {
      this.setState({ loading: true });
      this.props.onLogin(formValues).catch(err => {
        this.setState({ loading: false });
        console.log(err.message);
        if (err.code === 101) {
          showAlert(err.message);
        } else {
          showAlert("There seems to be a problem logging in");
        }
      });
    }
  }

  render() {
    return (
      <View>
        <KeyboardAwareScrollView>
          <View style={[styles.container, { justifyContent: "center" }]}>
            <VectorDrawableView
              accessibilityLabel="auth__logo"
              resourceName="ic_microumbrella_word_white"
              style={styles.logo}
            />
            <Text style={styles.mustLogin} />
            <Form ref="form" type={UserLogin} options={userLoginOptions} />
            <Button
              accessibilityLabel="auth__login-btn"
              onPress={this.handleLogin}
              style={styles.signinButton}
            >
              <View style={styles.signinButtonContainer}>
                <Text style={styles.signinButtonText}>LOGIN</Text>
                {this.state.loading ? (
                  <ActivityIndicator style={{ marginLeft: 10 }} color="white" />
                ) : null}
              </View>
            </Button>
            <TouchableOpacity
              accessibilityLabel="auth__go-to-signup"
              onPress={this.props.onNavigateToSignUp}
              style={{ marginVertical: 20 }}
              activeOpacity={0.5}
            >
              <Text style={styles.bottomBtn}>New member? Sign Up.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onNavigateToForgotPassword}
              activeOpacity={0.5}
            >
              <Text style={styles.bottomBtn}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const ForgotPassword = t.struct({
  email: t.String
});
const forgotPasswordOptions = {
  fields: {
    email: {
      label:
        "Enter your email address, we will send you an email to reset your password.",
      keyboardType: "email-address",
      error: "Enter a valid email"
    }
  }
};

class ForgotPasswordScreen extends Component {
  handlePasswordReset() {
    const formValues = this.refs.form.getValue();
    if (formValues) {
      showAlert("An password reset email has been sent to the email address");
      this.props.onNavigateToLogin();
    }
  }

  render() {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <VectorDrawableView
          resourceName="ic_microumbrella_word_white"
          style={styles.logo}
        />
        <Form
          ref="form"
          type={ForgotPassword}
          options={forgotPasswordOptions}
        />
        <Button
          onPress={this.handlePasswordReset.bind(this)}
          style={styles.signinButton}
        >
          SEND EMAIL
        </Button>
        <TouchableOpacity
          onPress={this.props.onNavigateToLogin}
          style={{ marginTop: 20 }}
          activeOpacity={0.5}
        >
          <Text style={[styles.bottomBtn, { marginTop: 10 }]}>
            Already a member? Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class AuthScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      screen: "Login",
      renderBackgroundImage: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleNavigateToLogin = this.handleNavigateToLogin.bind(this);
    this.handleNavigateToSignUp = this.handleNavigateToSignUp.bind(this);
    this.handleNavigateToForgotPassword = this.handleNavigateToForgotPassword.bind(
      this
    );
    this.handleRedirectToPurchase = this.handleRedirectToPurchase.bind(this);
  }

  handleSignup(form) {
    let user = new Parse.User();
    user.set("username", form.email);
    user.set("password", form.password);
    user.set("email", form.email);
    user.set("firstName", form.firstName);
    user.set("lastName", form.lastName);
    user.set("telephone", form.telephone);

    const referralCode = generateID(6);
    user.set("referralCode", referralCode);

    const beneficiaryCode = generateID(6);
    user.set("beneficiaryCode", beneficiaryCode);

    return user.signUp(null).then(user => {
      this.handleRedirectToPurchase(user);
    });
  }

  handleLogin(form) {
    const { email, password } = form;
    return Parse.User.logIn(email, password).then(user => {
      this.handleRedirectToPurchase(user);
    });
  }

  handleRedirectToPurchase(currentUser: any) {
    let policy;
    if (this.props.navigation.state.params) {
      policy = this.props.navigation.state.params.policy;
    }
    const resetAction = NavigationActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({
          routeName: "Chat",
          params: {
            isStartScreen: true,
            questionSet: "buy",
            policy: null,
            currentUser
          }
        }),
        NavigationActions.navigate({
          routeName: "Policy",
          params: { policy }
        }),
        NavigationActions.navigate({
          routeName: "Chat",
          params: {
            isStartScreen: false,
            questionSet: "buy",
            policy,
            currentUser
          }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.screenProps.rootNavigation.dispatch(resetAction);
    // this.props.navigation.dispatch(resetAction);
  }

  handleNavigateToLogin() {
    this.setState({ screen: "Login" });
  }

  handleNavigateToSignUp() {
    this.setState({ screen: "SignUp" });
  }

  handleNavigateToForgotPassword() {
    this.setState({ screen: "ForgotPassword" });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() =>
      this.setState({ renderBackgroundImage: true })
    );
  }

  render() {
    let screen;
    switch (this.state.screen) {
      case "Login":
        page = (
          <LoginScreen
            onLogin={this.handleLogin}
            onNavigateToSignUp={this.handleNavigateToSignUp}
            onNavigateToForgotPassword={this.handleNavigateToForgotPassword}
          />
        );
        break;
      case "SignUp":
        page = (
          <SignUpScreen
            onSignUp={this.handleSignup}
            navigation={this.props.navigation}
            onNavigateToLogin={this.handleNavigateToLogin}
          />
        );
        break;
      case "ForgotPassword":
        page = (
          <ForgotPasswordScreen
            navigation={this.props.navigation}
            onNavigateToLogin={this.handleNavigateToLogin}
          />
        );
        break;
      default:
        break;
    }

    let backgroundImage;
    if (this.state.renderBackgroundImage) {
      backgroundImage = (
        <Image
          source={require("../images/background.png")}
          style={styles.backgroundImage}
        />
      );
    } else {
      backgroundImage = null;
    }

    return (
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <View style={styles.page}>
          <StatusBar
            hidden={true}
            backgroundColor={colors.primaryOrange}
            barStyle="light-content"
          />
          {backgroundImage}
          {page}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  signinButtonText: {
    color: "white",
    fontSize: 16
  },
  signinButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  mustLogin: {
    alignSelf: "center",
    marginTop: 10,
    fontSize: 15,
    color: "white",
    backgroundColor: "transparent"
  },
  tosSwitch: {
    marginTop: 10,
    marginBottom: 20
  },
  touchableText: {
    fontWeight: "bold",
    color: "black"
  },
  textContainerText: {
    color: "white",
    backgroundColor: "transparent"
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 5
  },
  signinButton: {
    backgroundColor: "#8BC34A"
  },
  signUpHeader: {
    marginBottom: 15,
    fontSize: 26,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent"
  },
  bottomBtn: {
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    fontSize: 17,
    marginTop: 15
  },
  textinput: {
    height: 50
  },
  container: {
    flex: 1,
    paddingHorizontal: 30
  },
  logo: {
    height: 40
  },
  backgroundImage: {
    // flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  page: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primaryOrange
  }
});
