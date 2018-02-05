// @flow
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
  Animated,
  InteractionManager,
  FlatList,
  ActivityIndicator
} from "react-native";
import { chunk as chunkArray } from "lodash";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "react-native-image-picker";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { TabNavigator, TabBarTop, NavigationActions } from "react-navigation";
import VectorDrawableView from "./VectorDrawableView";
import ModalPicker from "react-native-modal-picker";

import AppStore from "../../stores/AppStore";
const colors = AppStore.colors;
import RangeSlider from "./RangeSlider";
import { Text } from "./defaultComponents";
import { getDateStr, addCommas, showAlert } from "../utils";
import Button from "./Button";
import { ValidationResult } from "../models/base-validations";
import { validateOneAnswer } from "../models/validations";
import tabStyles from "../styles/TabBar.styles";
import { saveNewDocument } from "../parse/claims";

import type { QuestionTableColumnType } from "../../../types/app";
import type { NavigationScreenProp } from "react-navigation/src/TypeDefinition";

const imageHeight = 150;
const imageWidth = 100;
const itemSeparatorComponent = () => <View style={styles.separator} />;

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
    const placeholder = "SELECT DATE";
    return (
      <DatePicker
        ref={this.props.datepickerRef}
        style={{ flex: 1, paddingBottom: 20 }}
        date={this.state.date}
        mode={mode}
        placeholder={placeholder}
        format={format}
        maxDate={maxDate}
        minDate={minDate}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={this.props.customStyles}
        onDateChange={this.onPickDate.bind(this)}
        iconSource={require("../../images/date-icon.png")}
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
    const coverageDurations = AppStore.coverageDurations;
    const initialCoverageDuration = coverageDurations[0];
    this.state = {
      months: initialCoverageDuration
    };
    props.onChangeDuration(initialCoverageDuration);
  }

  render() {
    const elements = AppStore.coverageDurations.map(d => ({
      label: d + "m",
      value: d
    }));
    const { months } = this.state;
    const s = months > 1 ? "S" : "";
    const totalPremium = (this.props.monthlyPremium * months).toFixed(2);
    const buttonText = `CHOOSE ${months + ""} MONTH${s} - $${totalPremium}`;
    return (
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>
          {months} MONTH{s}
        </Text>
        <RangeSlider
          elements={elements}
          onValueChange={months => {
            this.props.onChangeDuration(months);
            this.setState({ months });
          }}
          containerStyle={{
            marginBottom: 20
          }}
        />
      </View>
    );
  }
}

export class ImageTable extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.handleFinishSelectImages = this.handleFinishSelectImages.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.state = {
      loadingImage: false,
      images: {},
      parseFiles: [],
      error: false
    };
    const { columns } = this.props;
    for (var i = 0; i < columns.length; i++) {
      this.state.images[columns[i].id] = null;
    }
    this.imagePickerOptions = {
      noData: true,
      storageOptions: {}
    };
  }

  handlePress(id) {
    return () => {
      if (this.state.loadingImage) return;
      this.setState({ loadingImage: true });
      ImagePicker.showImagePicker(this.imagePickerOptions, response => {
        if (response.didCancel || response.error) {
          if (response.didCancel) {
            console.log("User cancelled image picker");
          } else if (response.error) {
            console.error(response.error);
          }
          this.setState({ loadingImage: false });
        } else {
          let newImages = Object.assign({}, this.state.images);
          if (!newImages[id]) {
            newImages[id] = [];
          }
          // console.log(response);
          const filepath = Platform.select({
            ios: response.uri,
            android: "file://" + response.path
          });
          const imageLen = newImages[id].push(null);
          this.setState({ images: newImages });
          const imageIndex = imageLen - 1;
          saveNewDocument(id, imageIndex, filepath)
            .then(imageFile => {
              let loadedNewImages = JSON.parse(JSON.stringify(newImages));
              loadedNewImages[id][imageIndex] = filepath;
              const parseFiles = this.state.parseFiles
                .slice()
                .concat(imageFile);
              this.setState({
                loadingImage: false,
                images: loadedNewImages,
                parseFiles
              });
            })
            .catch(err => {
              console.error(err);
            });
          // this.setState({ images: newImages });
        }
      });
    };
  }

  handleFinishSelectImages() {
    if (this.state.loadingImage) {
      showAlert("Please wait, image is loading");
      return;
    }

    const keys = Object.keys(this.state.images);
    const imageURIs = keys.map(key => this.state.images[key]);
    const imageURILen = imageURIs.length;
    const numberOfNonNullImageURI = imageURIs.filter(i => i !== null).length;
    // n-2 images sent
    if (numberOfNonNullImageURI >= Math.max(imageURILen - 2, 0)) {
      this.setState({ error: false });
      this.props.onFinishSelectImages(this.state.parseFiles);
      return;
    }
    this.setState({ error: true });
  }

  renderAddImage(column) {
    return (
      <TouchableOpacity
        opacity={0.8}
        accessibilityLabel={"chat__image-" + column.id}
        onPress={this.handlePress(column.id)}
      >
        <View style={[styles.imageSquare, styles.imageBorder, styles.addImage]}>
          <Icon name="add" size={45} style={styles.addImageIcon} />
        </View>
      </TouchableOpacity>
    );
  }

  renderImage(uri, idx) {
    if (uri === null) {
      return (
        <View key={idx} style={[styles.imageSquare, styles.imageBorder]}>
          <ActivityIndicator color="black" size="small" />
        </View>
      );
    }
    return (
      <Image
        key={idx}
        resizeMode="cover"
        source={{ uri }}
        style={[styles.imageSquare, styles.imageBorder]}
      />
    );
  }

  renderRow({ item: column }) {
    var imageURIs = this.state.images[column.id];
    var images = [];
    if (imageURIs) {
      images = imageURIs
        .slice()
        .reverse()
        .map(this.renderImage);
    }
    return (
      <View style={styles.imageTableRow}>
        <Text>{column.label}</Text>
        <ScrollView
          contentContainerStyle={styles.imageRow}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          overScrollMode="never"
        >
          {this.renderAddImage(column)}
          {images}
        </ScrollView>
      </View>
    );
  }

  render() {
    const minImages = Math.max(1, this.props.columns.length - 2);
    const responses = [
      { isValid: false, errMessage: `Must upload at least ${minImages} images` }
    ];
    return (
      <View style={styles.imageTableContainer}>
        <View style={styles.imageTable}>
          <FlatList
            data={this.props.columns}
            keyExtractor={item => item.id}
            renderItem={this.renderRow}
            ItemSeparatorComponent={itemSeparatorComponent}
            extraData={this.state.images}
          />
          <Button
            onPress={this.handleFinishSelectImages}
            style={styles.confirmUpload}
          >
            UPLOAD IMAGES
          </Button>
        </View>
        {this.state.error ? <ErrorMessages responses={responses} /> : null}
      </View>
    );
  }
}

export class ClaimPolicyChoice extends Component {
  constructor(props) {
    super(props);
    this.renderPolicy = this.renderPolicy.bind(this);
    this.state = {
      disabled: false,
      topAnim: new Animated.Value(40),
      fadeAnim: new Animated.Value(0)
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

  handleSelectPolicy(policy) {
    this.setState({ disabled: true });
    this.props.onSelectPolicy(policy);
  }

  renderPolicy({ item: policy }) {
    const policyTypeId = policy.get("policyTypeId");
    const { title: policyTypeTitle } = AppStore.policies.find(
      p => p.id === policyTypeId
    );
    const policyId = policy.get("policyId");
    const purchaseDate = getDateStr(policy.get("createdAt"));
    const premium = policy.get("premium");
    return (
      <TouchableOpacity
        accessibilityLabel={"claim__policy-" + policyId}
        onPress={() => this.handleSelectPolicy(policy)}
        disabled={this.state.disabled}
        key={policyId}
      >
        <View
          style={[
            styles.policyContainer,
            this.state.disabled ? styles.disabledPolicyChoice : null
          ]}
        >
          <Text style={styles.policyChoiceName}>{policyTypeTitle}</Text>
          <Text style={styles.policyDetailText}>Policy No.: {policyId}</Text>
          <Text style={styles.policyDetailText}>
            Purchase date: {purchaseDate}
          </Text>
          {/*policy.coverageSummary.length ? (
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
          ) : null*/}
          <Text style={styles.policyDetailText}>
            Premium: {AppStore.currency}
            {premium.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let content;

    if (this.props.loadingPolicies) {
      content = (
        <View style={styles.claimScreenContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    } else if (this.props.policies && !this.props.policies.length) {
      const navigateToPurchaseAction = NavigationActions.reset({
        key: null,
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "Drawer",
            action: NavigationActions.navigate({
              routeName: "BuyStack"
            })
          })
        ]
      });
      content = (
        <View style={styles.claimScreenContainer}>
          <Text style={styles.claimScreenText}>
            No policies to claim.{"\n"}Shop for one today.
          </Text>
          <Button
            onPress={() =>
              this.props.rootNavigation.dispatch(navigateToPurchaseAction)}
          >
            PURCHASE NEW POLICY
          </Button>
        </View>
      );
    } else if (this.props.errLoadingPoliciesMsg) {
      const message =
        this.props.errLoadingPoliciesMsg.code === 100
          ? "No network connection,\nconnect to WiFi or data"
          : "Oops... something went wrong";
      content = (
        <View style={styles.claimScreenContainer}>
          <Text style={styles.claimScreenText}>{message}</Text>
        </View>
      );
    } else {
      // extraData used to re-render FlatList
      content = (
        <Animated.View
          style={[
            styles.choicesContainer,
            { opacity: this.state.fadeAnim, top: this.state.topAnim }
          ]}
        >
          <FlatList
            keyExtractor={policy => policy.id}
            data={this.props.policies}
            renderItem={this.renderPolicy}
            extraData={this.state.disabled}
          />
        </Animated.View>
      );
    }
    return content;
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
    const startStylesOrNull = index === 0 ? styles.choicesStart : null;
    const endStylesOrNull = index === len - 1 ? styles.choicesEnd : null;
    const choiceTouchableEnd =
      index === len - 1 ? styles.choiceTouchableEnd : null;
    return (
      <View
        style={[styles.choiceContainer, startStylesOrNull, endStylesOrNull]}
        key={choice.value}
      >
        <TouchableHighlight
          accessibilityLabel={"chat__choice-item-" + choice.value.toString()}
          style={[styles.choiceTouchable, choiceTouchableEnd]}
          onPress={() => this.handlePickChoice(choice)}
          activeOpacity={0.6}
          underlayColor={colors.softBorderLine}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.choiceText}>{choice.label}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const disabledStyle = this.state.disabled
      ? styles.disabledChoiceList
      : null;
    return (
      <View style={[styles.choicesList, disabledStyle]}>
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
      <View key={idx} style={[styles.errMessage, { alignItems: "center" }]}>
        <Text style={styles.errMessageText}>{response.errMessage}</Text>
      </View>
    );
  }

  render() {
    const { fadeAnim, topAnim } = this.state;
    return (
      <Animated.View
        style={[
          styles.errContainer,
          { marginHorizontal: 0 },
          { opacity: fadeAnim, top: topAnim }
        ]}
      >
        {this.props.responses.map(this.renderError)}
      </Animated.View>
    );
  }
}

const sideIconSize = 30;

type TableInputProps = {
  screenTitle: string,
  renderItemText: Object => string,
  addButtonText: string,
  sendButtonText: string,
  sendButtonTextWhenEmpty: string,
  columns: Array<QuestionTableColumnType>,
  onSubmit: (items: Array<Object>) => void,
  navigation: TableInputNavigation
};

type TableInputNavigationState = {
  params: Object
};
type TableInputNavigation = NavigationScreenProp<TableInputNavigationState, *>;

export class TableInput extends Component {
  handleSaveNewItem: (
    navigation: TableInputNavigation,
    tableValues: Object
  ) => void;
  renderItem: ({ item: Object, index: number }) => View;
  multiInputRefs: Array<Object>;

  constructor(props: TableInputProps) {
    super(props);
    this.handleSaveNewItem = this.handleSaveNewItem.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.multiInputRefs = [];
    this.state = {
      items: []
    };
  }

  handleSaveNewItem(navigation: TableInputNavigation, tableValues: Object) {
    const { columns } = this.props;
    const SPOUSE_ID = 1;
    const CHILD_ID = 2;
    const isValid = tableValues.every(v => v !== "");
    const currentParams = navigation.state.params;
    // if (!isValid) {
    //   showAlert("The form is incomplete");
    //   navigation.setParams({ renderError: true, ...currentParams });
    //   return;
    // }
    // const dobIndex = columns.findIndex(c => c.id === "DOB");
    // const relationshipIndex = columns.findIndex(c => c.id === "relationship");
    // const dob = tableValues[dobIndex];
    // const relationshipId = tableValues[relationshipIndex];
    // const ageInMonths = moment(new Date()).diff(dob, "months");
    // if (relationshipId === CHILD_ID && ageInMonths < 3) {
    //   showAlert("Child cannot be less than 3 months old");
    //   navigation.setParams({ renderError: true, ...currentParams });
    //   return;
    // }
    // if (relationshipId === CHILD_ID && ageInMonths > 12 * 18) {
    //   showAlert("Child cannot be older than 18 years old");
    //   navigation.setParams({ renderError: true, ...currentParams });
    //   return;
    // }
    // if (relationshipId === SPOUSE_ID && ageInMonths < 12 * 18) {
    //   showAlert("Adult must be older than 18 years old");
    //   navigation.setParams({ renderError: true, ...currentParams });
    //   return;
    // }
    // const firstNameIndex = columns.findIndex(c => c.id === "firstName");
    // const lastNameIndex = columns.findIndex(c => c.id === "lastName");
    // const firstName = tableValues[firstNameIndex];
    // const lastName = tableValues[lastNameIndex];
    // const namePattern = /^([A-Za-z ,\.@/\(\)])+$/;
    // const firstNameMatch = firstName.match(namePattern);
    // const lastNameMatch = lastName.match(namePattern);
    // if (!firstNameMatch) {
    //   showAlert(
    //     "First name must only contain alphabets and these symbols: @, / and ()"
    //   );
    //   navigation.setParams({ renderError: true, ...currentParams });
    //   return;
    // }
    // if (!lastNameMatch) {
    //   showAlert(
    //     "Last name must only contain alphabets and these symbols: @, / and ()"
    //   );
    //   navigation.setParams({ renderError: true, ...currentParams });
    //   return;
    // }

    navigation.dispatch(NavigationActions.back());

    let item = {};
    tableValues.forEach((value, idx) => {
      item[columns[idx].id] = value;
    });
    item.key = this.state.items.length;
    const items = this.state.items.concat(item);
    this.setState({ items });
  }

  // handleSaveNewItem(values) {
  //   let item = {};
  //   const columns = this.props.columns;
  //   values.forEach((value, idx) => {
  //     item[columns[idx].id] = value;
  //   });
  //   item.key = this.state.items.length;
  //   const items = this.state.items.concat(item);
  //   this.setState({ items });
  // }

  renderItem({ item, index }: { item: Object, index: number }) {
    const itemText = this.props.renderItemText(item);
    return (
      <View style={styles.tableItemContainer}>
        <TouchableOpacity
          accessibilityLabel="purchase__remove-traveller"
          onPress={() => {
            const items = this.state.items.slice();
            items.splice(index, 1);
            this.setState({ items });
          }}
        >
          <Icon
            size={sideIconSize}
            style={styles.removeItemIcon}
            name="remove-circle-outline"
          />
        </TouchableOpacity>
        <Text style={styles.tableItemText}>{itemText}</Text>
      </View>
    );
  }

  render() {
    const itemSeparatorComponent = () => <View style={styles.separator} />;
    const shouldRenderSendButton =
      (typeof this.props.sendButtonTextWhenEmpty === "string" &&
        !this.state.items.length) ||
      this.state.items.length;
    return (
      <View style={styles.tableContainer}>
        <FlatList
          data={this.state.items}
          renderItem={this.renderItem}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
        <TouchableOpacity />
        {this.state.items.length ? itemSeparatorComponent() : null}
        <TouchableOpacity
          accessibilityLabel="purchase__add-traveller"
          onPress={() =>
            this.props.navigation.navigate("Table", {
              title: this.props.screenTitle,
              columns: this.props.columns,
              onSaveTable: this.handleSaveNewItem
            })}
        >
          <View style={styles.addTableItem}>
            <Icon
              size={sideIconSize}
              style={styles.addTableItemIcon}
              name="add-circle-outline"
            />
            <Text style={styles.addTable}>{this.props.addButtonText}</Text>
          </View>
        </TouchableOpacity>
        {shouldRenderSendButton ? (
          <Button
            accessibilityLabel="chat__submit-traveller"
            style={styles.tableSendButton}
            onPress={() => this.props.onSubmit(this.state.items)}
          >
            {this.state.items.length ? (
              this.props.sendButtonText
            ) : (
              this.props.sendButtonTextWhenEmpty
            )}
          </Button>
        ) : null}
      </View>
    );
  }
}

export function TravellerTableInput({
  columns,
  onSubmit,
  navigation
}: {
  columns: Array<QuestionTableColumnType>,
  onSubmit: (items: Array<Object>) => void,
  navigation: TableInputNavigationState
}) {
  const isNotMYApp = AppStore.countryCode !== "MY";

  const renderItemText = item => {
    let fullName;
    if (isNotMYApp) {
      const { firstName, lastName } = item;
      fullName = `${firstName} ${lastName}`;
    } else {
      fullName = item.fullName;
    }
  };

  return (
    <TableInput
      validate={() => {}}
      renderItemText={renderItemText}
      screenTitle="Add New Traveller"
      addButtonText="ADD NEW TRAVELLER"
      sendButtonText="SEND"
      sendButtonTextWhenEmpty={isNotMYApp ? "I'M TRAVELLING ALONE" : null}
      columns={columns}
      onSubmit={onSubmit}
      navigation={navigation}
    />
  );
}

export function LostOrDamagedItemsTableInput({
  columns,
  onSubmit,
  navigation
}: {
  columns: Array<QuestionTableColumnType>,
  onSubmit: (items: Array<Object>) => void,
  navigation: TableInputNavigationState
}) {
  const renderItemText = item => item.description;

  return (
    <TableInput
      validate={() => {}}
      renderItemText={renderItemText}
      screenTitle="Add New Item"
      addButtonText="ADD NEW ITEM"
      sendButtonText="SEND"
      sendButtonTextWhenEmpty={null}
      columns={columns}
      onSubmit={onSubmit}
      navigation={navigation}
    />
  );
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
    for (var i = 0; i < props.columns.length; i++) {
      const column = props.columns[i];
      if (
        column.responseType.indexOf("date") !== -1 ||
        column.responseType.indexOf("datetime") !== -1
      ) {
        this.state.values.push(new Date());
      } else {
        this.state.values.push("");
      }
      this.state.responses.push(new ValidationResult(true, true));
    }
    this.renderInput = this.renderInput.bind(this);
    this.handlePickDate = this.handlePickDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputRefs = [];
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
      label: this.props.columns[idx].label,
      id: this.props.columns[idx].id
    }));
    const validationResponses = inputs.map((input, idx) => {
      const column = this.props.columns[idx];
      const responseTypes = [].concat(column.responseType.slice());
      if (responseTypes.indexOf("choice") !== -1) {
        const choiceValues = column.choices.map(c => c.value);
        if (choiceValues.indexOf(input.value) === -1) {
          return {
            isValid: false,
            errMessage: `${input.label} must be selected.`
          };
        }
      }
      return validateOneAnswer(responseTypes, input.value);
    });
    const lenResponses = inputs.map((input, idx) => {
      const column = this.props.columns[idx];
      const responseLength = column.responseLength;
      if (responseLength && input.value.length > responseLength) {
        return {
          isValid: false,
          errMessage: `${input.label} cannot be longer than ${responseLength} characters`
        };
      }
      return { isValid: true, errMessage: true };
    });

    Promise.all(validationResponses).then(validationResponses => {
      const responses = inputs.map((input, idx) => {
        const validationResponse = validationResponses[idx];
        const lenResponse = lenResponses[idx];
        if (!validationResponse.isValid) {
          return validationResponse;
        } else if (!lenResponse.isValid) {
          return lenResponse;
        }
        return validationResponse;
      });
      const allLegit = responses.every(r => r.isValid);
      if (allLegit) {
        this.props.onSubmit(inputs);
        return;
      }
      this.setState({ responses });
    });
  }

  renderInput(input, index, inputs) {
    const len = inputs.length;
    const startStylesOrNull = index === 0 ? styles.choicesStart : null;
    const endStylesOrNull = index === len - 1 ? styles.choicesEnd : null;

    const response = this.state.responses[index];
    const responseTypes = [].concat(input.responseType);

    let inputElement;
    if (
      responseTypes.indexOf("date") !== -1 ||
      responseTypes.indexOf("datetime") !== -1
    ) {
      inputElement = (
        <TouchableOpacity onPress={() => this.inputRefs[index].onPressDate()}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateInputPlaceholder}>{input.label}</Text>
            <MyDatePicker
              datepickerRef={picker => (this.inputRefs[index] = picker)}
              mode={input.responseType}
              onPickDate={this.handlePickDate(index)}
              customStyles={{
                dateTouchBody: {
                  width: 200,
                  marginBottom: -20
                },
                dateIcon: {
                  position: "absolute",
                  left: 0
                },
                dateInput: { borderWidth: 0, marginLeft: 36 },
                btnTextConfirm: {
                  color: colors.primaryAccent
                }
              }}
            />
          </View>
        </TouchableOpacity>
      );
    } else if (responseTypes.indexOf("choice") !== -1) {
      const data = input.choices.map(choice => ({
        key: choice.value,
        label: choice.label
      }));
      const currentVal = this.state.values[index];
      let pickerValue;
      if (currentVal === "") {
        pickerValue = "Select " + input.label.toLowerCase();
      } else {
        const choice = data.find(choice => choice.key === currentVal);
        pickerValue = choice.label;
      }

      inputElement = (
        <ModalPicker
          data={data}
          initValue={pickerValue}
          onChange={option => {
            const values = [].concat(this.state.values);
            values[index] = option.key;
            this.setState({ values });
          }}
          selectStyle={styles.select}
          selectTextStyle={styles.selectText}
        />
      );
    } else {
      let keyboardType = "default";
      if (responseTypes.indexOf("number") !== -1) keyboardType = "numeric";
      if (responseTypes.indexOf("email") !== -1) keyboardType = "email-address";
      if (responseTypes.indexOf("") !== -1) keyboardType = "email-address";
      let autoCapitalize = "none";
      if (responseTypes.indexOf("name") !== -1) autoCapitalize = "words";
      inputElement = (
        <TextInput
          accessibilityLabel={"chat__input-" + input.id}
          key={input.id}
          style={styles.textInput}
          placeholder={input.label}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
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
          styles.textInputContainer,
          !response.isValid ? styles.textInputError : null,
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
      <View key={idx} style={styles.errMessage}>
        <Text style={styles.errMessageText}>{response.errMessage}</Text>
      </View>
    );
  }

  render() {
    let { fadeAnim, topAnim } = this.state;
    let inputContainer;

    if (this.props.columns.length > 5) {
      inputContainer = chunkArray(
        this.props.columns,
        2
      ).map((chunk, chunkIdx) => {
        return (
          <View
            key={chunkIdx}
            style={{
              flexDirection: "row",
              alignItems: "stretch"
            }}
          >
            {chunk.map((input, inputIdx) => {
              const computedIdx = chunkIdx * 2 + inputIdx;
              return this.renderInput(input, computedIdx, this.props.columns);
            })}
          </View>
        );
      });
    } else {
      inputContainer = (
        <View style={{ flex: 1 }}>
          {this.props.columns.map(this.renderInput)}
        </View>
      );
    }

    if (!this.props.submitButtonComponent) {
      button = (
        <Button
          accessibilityLabel="chat__multiinput-send"
          onPress={this.handleSubmit}
          style={styles.sendButtonContainer}
        >
          SEND
        </Button>
      );
    } else {
      button = this.props.submitButtonComponent(this.state.values);
    }
    const keyboardHeight = Platform.select({
      ios:
        this.props.keyboardHeight >= 200
          ? this.props.keyboardHeight - 200
          : 200,
      android: 300
    });
    return (
      <View style={{ marginBottom: keyboardHeight }}>
        <View style={[styles.choicesList]}>
          {inputContainer}
          {button}
        </View>
        <Animated.View
          style={[styles.errContainer, { opacity: fadeAnim, top: topAnim }]}
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
    this.state = {
      fadeAnim: new Animated.Value(0),
      topAnim: new Animated.Value(100)
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
        duration: 0
      }
    ).start();
  }

  renderSuggestion({ item }) {
    return (
      <TouchableHighlight
        accessibilityLabel={"chat__suggestion-" + item.value}
        onPress={() => {
          this.props.onSelectSuggestion(item);
        }}
        key={item.value}
      >
        <View style={styles.suggestionContainer}>
          <Text>{item.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    let scrollView = null;

    if (this.props.items.length) {
      scrollView = (
        <FlatList
          style={styles.suggestionListScrollView}
          ItemSeparatorComponent={itemSeparatorComponent}
          keyboardShouldPersistTaps="always"
          data={this.props.items}
          renderItem={this.renderSuggestion}
          keyExtractor={(item, index) => index}
        />
      );
    } else if (this.props.searchValue && !this.props.items.length) {
      scrollView = (
        <View style={styles.emptyContainer}>
          <Text>No matching result. Please try other phrases.</Text>
        </View>
      );
    }

    return Platform.select({
      ios: (
        <Animated.View
          style={{
            top: this.state.topAnim,
            opacity: this.state.fadeAnim
          }}
        >
          {this.props.headerComponent || null}
          {scrollView}
        </Animated.View>
      ),
      android: (
        <View>
          {this.props.headerComponent || null}
          {scrollView}
        </View>
      )
    });
  }
}

class PlanTab extends Component {
  constructor(props) {
    super(props);
    this.renderCoverage = this.renderCoverage.bind(this);
    this.handleSelectPlan = this.handleSelectPlan.bind(this);
  }

  handleSelectPlan(planIndex) {
    return () => {
      if (typeof this.props.onSelectPlan === "function") {
        this.props.onSelectPlan(planIndex);
      }
    };
  }

  renderCoverage(planIdx, coverageKey) {
    const coverage = AppStore.coverages[coverageKey];
    const coverageAmount = addCommas(
      this.props.plans[planIdx].coverage[coverageKey]
    );
    return (
      <View key={coverageKey} style={styles.coverageRow}>
        <VectorDrawableView
          resourceName={coverage.icon}
          style={styles.coverageIcon}
        />
        <View style={styles.coverageDetailsContainer}>
          <Text style={styles.coverageTitleText}>{coverage.title}</Text>
          <Text style={styles.coverageAmountText}>${coverageAmount}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { plan, planIndex } = this.props;
    return (
      <View style={styles.planContainer}>
        <View style={styles.planContentContainer}>
          {Object.keys(plan.coverage).map(coverageKey =>
            this.renderCoverage(planIndex, coverageKey)
          )}
        </View>
        <Button
          accessibilityLabel={"chat__select-plan_" + plan.id}
          onPress={this.handleSelectPlan(planIndex)}
          style={styles.selectPlanButton}
        >
          SELECT PLAN
        </Button>
      </View>
    );
  }
}

const tabContainerStyle = Object.assign(
  {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  tabStyles.tabContainer
);

export class PlansTabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(
        // Animate value over time
        this.state.fadeAnim, // The value to drive
        {
          duration: 1000,
          toValue: 1 // Animate to final value of 1
        }
      ).start();
    });
  }

  render() {
    const { tabRoutes } = this.props;
    const _PlansTabNavigator = TabNavigator(tabRoutes, {
      // lazy: true,
      swipeEnabled: false,
      animationEnabled: Platform.select({ ios: true, android: false }),
      tabBarComponent: TabBarTop,
      tabBarPosition: "top",
      tabBarOptions: {
        upperCaseLabel: true,
        activeTintColor: colors.primaryAccent,
        inactiveTintColor: colors.primaryText,
        style: tabContainerStyle,
        tabStyle: tabStyles.tabItem,
        labelStyle: tabStyles.planTabLabel,
        indicatorStyle: tabStyles.tabIndicator
      }
    });
    return (
      <View style={[styles.plansTabContainer]}>
        <_PlansTabNavigator />
      </View>
    );
  }
}

export class PlansTabView extends Component {
  render() {
    const { plans } = this.props;
    let tabRoutes = {};
    Object.keys(plans).forEach((key, idx) => {
      const plan = plans[key];
      const planTitle = plan.title.split(" ").join("\n");
      tabRoutes[planTitle] = {
        screen: () => (
          <PlanTab
            onSelectPlan={this.props.onSelectPlan}
            plans={plans}
            plan={plan}
            planIndex={idx}
          />
        )
      };
    });
    return <PlansTabNavigator tabRoutes={tabRoutes} />;
  }
}

const multiInputPlaceholderSize = 16;
const iconSize = 50;

const styles = StyleSheet.create({
  tableContainer: {
    marginLeft: 50,
    marginRight: 60
  },
  tableSendButton: {
    height: 60,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  tableItemText: {
    fontSize: 17.5
  },
  removeItemIcon: {
    color: colors.errorRed,
    marginRight: 15
  },
  tableItemContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 0,
    backgroundColor: "white"
  },
  addTableItemIcon: {
    color: colors.primaryAccent,
    marginRight: 15
  },
  addTableItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 0,
    backgroundColor: "white"
  },
  dateInputContainer: {
    flex: 1,
    padding: 10
  },
  dateInputPlaceholder: {
    fontSize: 15,
    marginBottom: 5,
    color: colors.borderLine
  },
  confirmUpload: {
    height: 55,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  imageRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  addImageIcon: {
    color: colors.borderLine
  },
  imageTableRow: {
    marginHorizontal: 15,
    marginVertical: 15
  },
  imageTableContainer: {
    margin: 10
  },
  imageTable: {
    borderRadius: 10,
    backgroundColor: "white"
  },
  imageBorder: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.softBorderLine,
    alignItems: "center",
    justifyContent: "center"
  },
  imageSquare: {
    width: 50,
    height: 50
  },
  durationText: {
    marginBottom: 20,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center"
  },
  claimScreenText: {
    fontSize: 17,
    marginBottom: 15
  },
  claimScreenContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 30
  },
  select: {
    alignItems: "flex-start",
    borderWidth: 0
  },
  selectText: {
    color: colors.borderLine,
    fontSize: multiInputPlaceholderSize,
    textAlign: "left"
  },
  rightSeparator: { borderRightColor: colors.borderLine, borderRightWidth: 1 },
  coverageAmountText: {
    color: colors.primaryText,
    fontSize: 15
  },
  coverageTitleText: {
    flex: 1,
    flexWrap: "wrap",
    marginBottom: 5,
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "600"
  },
  coverageDetailsContainer: {
    marginVertical: 5,
    marginLeft: 15
  },
  coverageRow: {
    flexDirection: "row",
    marginVertical: 10
  },
  coverageIcon: {
    height: iconSize,
    width: iconSize
  },
  selectPlanButton: {
    borderRadius: 0
  },
  planTitle: {
    color: colors.primaryText
  },
  planContentContainer: {
    padding: 15,
    paddingVertical: 20
  },
  plansTabContainer: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 7,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#424242",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  noBorderRadius: {
    borderRadius: 0
  },
  errContainer: {
    // marginLeft: 50,
    // marginRight: 60
  },
  errMessageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryText,
    textAlign: "center"
  },
  errMessage: {
    marginTop: 10,
    padding: 15,
    borderRadius: 0,
    backgroundColor: "#FFCDD2"
  },
  suggestionListContainer: {
    flexGrow: 1,
    justifyContent: "flex-end"
  },
  suggestionListScrollView: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // bottom: 0,
    maxHeight: 150
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: "white"
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
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: CHOICE_SEPARATOR_WIDTH,
    borderColor: colors.borderLine
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    fontSize: multiInputPlaceholderSize
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
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 15,
    borderRadius: 3,
    shadowColor: colors.borderLine,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
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
    backgroundColor: colors.primaryAccent,
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
  },
  separator: {
    borderBottomColor: colors.softBorderLine,
    borderBottomWidth: 1
  }
});
