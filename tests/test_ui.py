# iOS environment
import sys
import os
import logging
from datetime import datetime

import timeout_decorator
import unittest
from time import sleep
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction

test_dir = os.path.dirname(os.path.realpath(__file__))
root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))

build_type = sys.argv[1]

if (build_type != 'release' and build_type != 'debug'):
    sys.exit()

apk_type = 'app-debug.apk'
if build_type == 'release':
    apk_type = 'app-release.apk'

ipa_type = 'Debug-iphonesimulator'
if build_type == 'release':
    ipa_type = 'Release-iphonesimulator'

android_app_path = os.path.join(
    root_dir, 'android', 'app', 'build', 'outputs', 'apk', apk_type)
ios_app_path = os.path.join(root_dir, 'ios', 'build', 'Build',
                            'Products', ipa_type,
                            'Microsurance.app')

LOGIN_EMAIL = 'x@aa.com'
LOGIN_PASSWORD = '1234abcd'

local_caps = {
    # 'android': {
    #     'platformName': 'Android',
    #     'platformVersion': '7.0',
    #     'deviceName': 'Redmi',
    #     'app': android_app_path
    # },
    # 'android': {
    #     'platformName': 'Android',
    #     'platformVersion': '6.0',
    #     'deviceName': 'Redmi',
    #     'app': android_app_path
    # },
    'iPhone 5s': {
        'platformName': 'iOS',
        'platformVersion': '10.3',
        'deviceName': 'iPhone 5s',
        'app': ios_app_path
    }
}

current_cap = {}

LOCAL_TIMEOUT = 10

LOAD_TIME_MULTIPLY = 2

if build_type == 'debug':
    LOAD_TIME_MULTIPLY = 1


class AppiumTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub', current_cap)
        self.find_accessibility = self.driver.find_element_by_accessibility_id

    def tap_on(self, el):
        action = TouchAction(self.driver)
        action.tap(el).perform()

    def dismiss_keyboard(self):
        platform_name = self.driver.capabilities['platformName']
        if platform_name == 'iOS':
            self.driver.hide_keyboard('Done')  # ios
        elif platform_name == 'Android':
            self.driver.press_keycode(4)  # android

    def tearDown(self):
        self.driver.quit()

    def test_purchase_travel(self):
        sleep(3)
        signin_el = self.find_accessibility('intro__sign-in')
        self.tap_on(signin_el)
        sleep(2 * LOAD_TIME_MULTIPLY)
        self.do_login_flow()
        sleep(2)
        menu_btn = self.find_accessibility('nav__menu-btn')
        self.assertIsNotNone(menu_btn)
        self.do_policy_check()
        travel_policy_choice = self.find_accessibility(
            'purchase__policy-choice-travel')
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)
        sleep(3)
        self.do_purchase_chatbot_flow()

    def do_login_flow(self):
        login_btn = self.find_accessibility('auth__login-btn')
        login_email_input = self.driver.find_elements_by_accessibility_id(
            'Email')[1]  # skip label
        login_password_input = self.driver\
            .find_elements_by_accessibility_id('Password')[1]  # skip label
        self.tap_on(login_email_input)
        self.driver.set_value(login_email_input, LOGIN_EMAIL)
        self.tap_on(login_password_input)
        self.driver.set_value(login_password_input, LOGIN_PASSWORD)
        self.tap_on(login_btn)  # to dismiss keyboard
        self.tap_on(login_btn)

    def do_policy_check(self):
        policies = ['travel', 'pa', 'pa_mr', 'pa_wi']
        for policy in policies:
            choice_el = self.find_accessibility(
                'purchase__policy-choice-'+policy)
            self.assertIsNotNone(choice_el)

    def do_purchase_chatbot_flow(self):
        COMPOSER_PLACEHOLDER = 'Type your message here...'
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        plan_select_btn = self.find_accessibility('SELECT PLAN')
        self.tap_on(plan_select_btn)
        sleep(2 * LOAD_TIME_MULTIPLY)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, 'Malaysia')
        sleep(0.5)
        malaysia_country_suggestion = self.find_accessibility(
            'chat__suggestion-55')
        self.tap_on(malaysia_country_suggestion)
        sleep(1 * LOAD_TIME_MULTIPLY)
        # with open('source.txt', 'w') as f:
        #     f.write(self.driver.page_source)
        self.tap_on(self.find_accessibility('chat__datepicker'))
        sleep(1)
        self.tap_on(self.find_accessibility('Confirm'))
        sleep(1 * LOAD_TIME_MULTIPLY)
        self.tap_on(self.find_accessibility('chat__datepicker'))
        sleep(1)
        self.tap_on(self.find_accessibility('Confirm'))
        sleep(1.5 * LOAD_TIME_MULTIPLY)

        # FIRST AND LAST NAME
        # first_name_input = self.find_accessibility('chat__input-firstName')
        # last_name_input = self.find_accessibility('chat__input-lastName')
        # self.tap_on(first_name_input)
        # self.driver.set_value(first_name_input, 'Ken')
        # self.tap_on(last_name_input)
        # self.driver.set_value(last_name_input, 'Chan')
        # sleep(0.5)
        # with open('source.txt', 'w') as f:
        #     f.write(self.driver.page_source)
        # self.tap_on(self.find_accessibility('chat__multiinput-send'))
        # sleep(0.5)
        # self.tap_on(self.find_accessibility('chat__multiinput-send'))
        # sleep(1.5 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.find_accessibility('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, '9999')
        self.tap_on(self.find_accessibility('Send'))
        sleep(0.5 * LOAD_TIME_MULTIPLY)

        # EMAIL ADDRESS
        # composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        # self.tap_on(composer)
        # self.driver.set_value(composer, 'guanhao3797@gmail.com')
        # self.tap_on(self.find_accessibility('Send'))
        # sleep(1 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.find_accessibility('chat__submit-traveller'))
        sleep(0.5 * LOAD_TIME_MULTIPLY)
        self.tap_on(self.find_accessibility('PROCEED'))
        sleep(10)

    # @timeout_decorator.timeout(20)
    # def test_signup_flow(self):
    #     sleep(1)
    #     signin_el = self.find_accessibility('intro__sign-in')
    #     self.assertIsNotNone(signin_el)
    #     self.tap_on(signin_el)
    #     sleep(1)
    #     go_to_signup = self.find_accessibility('auth__go-to-signup')
    #     self.assertIsNotNone(go_to_signup)
    #     self.tap_on(go_to_signup)
    #     sleep(1)
    #     signup_btn = self.find_accessibility('SIGN UP')
    #     signup_email_input = self.find_accessibility('Email')
    #     signup_password_input = self.find_accessibility(
    #         'Password')
    #     signup_telephone_input = self.find_accessibility(
    #         'Telephone')
    #     signup_confirm_password_input = self.find_accessibility(
    #         'Confirm password')
    #     signup_first_name_input = self.find_accessibility(
    #         'First name')
    #     signup_last_name_input = self.find_accessibility(
    #         'Last name')
    #     self.driver.set_value(signup_email_input, 'test@gmail.com')
    #     self.driver.set_value(signup_password_input, '1234abcd')
    #     self.driver.set_value(signup_confirm_password_input, '1234abcd')
    #     self.driver.set_value(signup_telephone_input, '8888888')
    #     self.driver.set_value(signup_first_name_input, '1234abcd')
    #     self.driver.set_value(signup_last_name_input, '1234abcd')
    #     self.tap_on(signup_btn)


if __name__ == "__main__":
    for cap in local_caps:
        current_cap = local_caps[cap]
        logging.basicConfig(stream=sys.stderr)
        logging.getLogger("AppiumTests").setLevel(logging.DEBUG)
        suite = unittest.TestLoader().loadTestsFromTestCase(AppiumTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
