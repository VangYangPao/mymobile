// @flow
import moment from "moment";
import { isObservableArray } from "mobx";

import { ValidationResult } from "./base-validations";
import AppStore from "../../stores/AppStore";

export function validateOneAnswer(
  responseTypes: Array<string>,
  answer: Object,
  answers: Array<Object>
) {
  const promises = responseTypes.map((responseType, idx) => {
    let validateFunc = AppStore.validations[responseTypes[idx]];
    const result = validateFunc(answer, answers);
    if (typeof result.then === "function") {
      return result;
    }
    return new Promise((resolve, reject) => {
      resolve(result);
    });
  });

  return Promise.all(promises)
    .then(results => {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (!result.isValid) return result;
      }
      return new ValidationResult(true, true);
    })
    .catch(err => console.log(err));
}

export function validateAnswer(question, answer, answers) {
  const { responseType } = question;
  const responseTypes = [].concat(
    isObservableArray(question.responseType)
      ? question.responseType.slice()
      : question.responseType
  );
  return validateOneAnswer(responseTypes, answer, answers).then(result => {
    if (result.isValid && question.responseLength && answer.length) {
      const { responseLength: maxLength } = question;
      if (answer.length > maxLength) {
        result = new ValidationResult(
          false,
          `Answer must be not longer than ${maxLength} characters`
        );
      }
    }
    return result;
  });
}
