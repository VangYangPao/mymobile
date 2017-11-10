import sys
import os
import unittest
import datetime
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from calendar import month_name

LOGIN_EMAIL = 'x@aa.com'
LOGIN_PASSWORD = '1234abcd'

THRESHOLD_SLEEP_TIME = 7


class MicroUmbrellaAppTest(unittest.TestCase):

    def __init__(self, *args):
        super().__init__(*args)

    def tearDown(self):
        self.driver.quit()

    def hide_keyboard(self):
        self.driver.hide_keyboard('return')

    def find_accessibility(self, accessibility_label):
        return self.driver.find_element_by_accessibility_id(
            accessibility_label)

    def tap_on(self, el):
        action = TouchAction(self.driver)
        action.tap(el).perform()

    def poll_accessibility(self, selector, threshold_sleep_time=THRESHOLD_SLEEP_TIME):
        return self.poll_tree_until_found(
            self.driver.find_element_by_accessibility_id,
            selector, threshold_sleep_time)

    def poll_tree_until_found(
            self, function, selector, threshold_sleep_time=THRESHOLD_SLEEP_TIME):
        counter = 1
        base_sleep_time = 0.1
        while True:
            try:
                el = function(selector)
                if el:
                    return el
                raise NoSuchElementException(
                    'Polling element tree error: '
                    + selector)
            except NoSuchElementException as e:
                sleep_time = base_sleep_time * counter
                if sleep_time >= threshold_sleep_time:
                    raise NoSuchElementException(
                        'Polling element tree threshold reached: '
                        + selector)
                sleep(sleep_time)
                counter += 1
            except Exception as e:
                raise e

    def paginate_date_till_value(
            self, picker_wheel, default_value, value, is_month=False):

        INCREMENT_VALUE = 3

        def send_picker_keys(value):
            if is_month:
                value = month_name[value]
            else:
                value = str(value)
            picker_wheel.send_keys(value)

        while True:
            if value > default_value:
                if value > default_value + INCREMENT_VALUE:
                    default_value += INCREMENT_VALUE
                    # print('default', default_value)
                    send_picker_keys(default_value)
                else:
                    # print('set', value)
                    send_picker_keys(value)
                    break
            else:
                if value < default_value - INCREMENT_VALUE:
                    default_value -= INCREMENT_VALUE
                    # print('default', default_value)
                    send_picker_keys(default_value)
                else:
                    # print('set', value)
                    send_picker_keys(value)
                    break

    def select_date(self, date):
        # datepicker = self.driver.find_elements_by_class_name(
        #     'XCUIElementTypePickerWheel')
        datepicker = self.poll_tree_until_found(
            self.driver.find_elements_by_class_name,
            'XCUIElementTypePickerWheel')
        now = datetime.datetime.now()
        self.paginate_date_till_value(
            datepicker[0], now.month, date.month, is_month=True)
        self.paginate_date_till_value(
            datepicker[1], now.day, date.day)
        self.paginate_date_till_value(
            datepicker[2], now.year, date.year)
        sleep(3)
        self.tap_on(self.find_accessibility('Confirm'))

    def login_user(self, email=LOGIN_EMAIL, password=LOGIN_PASSWORD):
        login_btn = self.poll_accessibility('auth__login-btn')
        login_email_input = self.driver.find_elements_by_accessibility_id(
            'Email')[1]  # skip label
        login_password_input = self.driver\
            .find_elements_by_accessibility_id('Password')[1]  # skip label
        self.tap_on(login_email_input)
        self.driver.set_value(login_email_input, email)
        self.tap_on(login_password_input)
        self.driver.set_value(login_password_input, password)
        self.tap_on(login_btn)  # to dismiss keyboard
        self.tap_on(login_btn)

    def check_policies_exist(self):
        policies = ['travel', 'pa', 'pa_mr', 'pa_wi']
        for policy in policies:
            choice_el = self.find_accessibility(
                'purchase__policy-choice-'+policy)
            self.assertIsNotNone(choice_el)

    def signup_user(self):
        sleep(1)
        signin_el = self.find_accessibility('intro__sign-in')
        self.assertIsNotNone(signin_el)
        self.tap_on(signin_el)
        sleep(1)
        go_to_signup = self.find_accessibility('auth__go-to-signup')
        self.assertIsNotNone(go_to_signup)
        self.tap_on(go_to_signup)
        sleep(1)
        signup_btn = self.find_accessibility('SIGN UP')
        signup_email_input = self.find_accessibility('Email')
        signup_password_input = self.find_accessibility(
            'Password')
        signup_telephone_input = self.find_accessibility(
            'Telephone')
        signup_confirm_password_input = self.find_accessibility(
            'Confirm password')
        signup_first_name_input = self.find_accessibility(
            'First name')
        signup_last_name_input = self.find_accessibility(
            'Last name')
        self.driver.set_value(signup_email_input, 'test@gmail.com')
        self.driver.set_value(signup_password_input, '1234abcd')
        self.driver.set_value(signup_confirm_password_input, '1234abcd')
        self.driver.set_value(signup_telephone_input, '8888888')
        self.driver.set_value(signup_first_name_input, '1234abcd')
        self.driver.set_value(signup_last_name_input, '1234abcd')
        self.tap_on(signup_btn)
