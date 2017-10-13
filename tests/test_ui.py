# iOS environment
import sys
import os
import logging

import timeout_decorator
import unittest
from time import sleep
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction

test_dir = os.path.dirname(os.path.realpath(__file__))
root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))
android_app_path = os.path.join(
    root_dir, 'android', 'app', 'build', 'outputs', 'apk', 'app-release.apk')
ios_app_path = os.path.join(root_dir, 'ios', 'build', 'Build',
                            'Products', 'Debug-iphonesimulator',
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
    'iPhone 5s': {
        'platformName': 'iOS',
        'platformVersion': '10.3',
        'deviceName': 'iPhone 5s',
        'app': ios_app_path
    }
}

current_cap = {}

LOCAL_TIMEOUT = 10


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
        sleep(1)
        travel_policy_choice = self.find_accessibility(
            'purchase__policy-choice-travel')
        self.assertTrue(travel_policy_choice.is_displayed())
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)
        sleep(0.5)
        login_btn = self.find_accessibility('LOGIN')
        login_email_input = self.driver.find_elements_by_accessibility_id(
            'Email')[1]  # skip label
        login_password_input = self.driver\
            .find_elements_by_accessibility_id('Password')[1]  # skip label
        self.tap_on(login_email_input)
        self.driver.set_value(login_email_input, LOGIN_EMAIL)
        self.tap_on(login_password_input)
        self.driver.set_value(login_password_input, LOGIN_PASSWORD)
        self.dismiss_keyboard()
        self.tap_on(login_btn)
        sleep(10)

    # @timeout_decorator.timeout(10)
    # def test_intro_flow(self):
    #     sleep(1)
    #     logo_el = self.find_accessibility('intro__logo')
    #     signin_el = self.find_accessibility('intro__sign-in')
    #     browse_el = self.find_accessibility('intro__browse')
    #     self.assertIsNotNone(logo_el)
    #     self.assertIsNotNone(signin_el)
    #     self.assertIsNotNone(browse_el)
    #     # sign_in_bottom_el = self.find_accessibility('intro__sign-in')
    #     for i in range(3):
    #         self.driver.swipe(300, 200, 100, 200)
    #     self.tap_on(signin_el)
    #     sleep(2)
    #     login_screen = self.find_accessibility('auth__login-screen')
    #     self.assertIsNotNone(login_screen)

    # @timeout_decorator.timeout(20)
    # def test_signin_flow(self):
    #     sleep(1)
    #     signin_el = self.find_accessibility('intro__sign-in')
    #     self.assertIsNotNone(signin_el)
    #     self.tap_on(signin_el)
    #     sleep(2)
    #     login_screen = self.find_accessibility('auth__login-screen')
    #     self.assertIsNotNone(login_screen)
    #     login_btn = self.find_accessibility('auth__login-btn')
    #     login_email_input = self.find_accessibility('auth__login-email')
    #     login_password_input = self.find_accessibility('auth__login-password')
    #     self.assertIsNotNone(login_btn)
    #     self.assertIsNotNone(login_email_input)
    #     self.assertIsNotNone(login_password_input)
    #     self.driver.set_value(login_email_input, LOGIN_EMAIL)
    #     self.driver.set_value(login_password_input, LOGIN_PASSWORD)
    #     self.tap_on(login_btn)
    #     sleep(2)

    # @timeout_decorator.timeout(20)
    # def test_signup_flow(self):
    #     sleep(1)
    #     signin_el = self.find_accessibility('intro__sign-in')
    #     self.assertIsNotNone(signin_el)
    #     self.tap_on(signin_el)
    #     sleep(1)
    #     login_screen = self.find_accessibility('auth__login-screen')
    #     self.assertIsNotNone(login_screen)
    #     go_to_signup = self.find_accessibility('auth__go-to-signup')
    #     self.assertIsNotNone(go_to_signup)
    #     self.tap_on(go_to_signup)
    #     sleep(1)
    #     signup_btn = self.find_accessibility('auth__signup-btn')
    #     signup_email_input = self.find_accessibility('auth__signup-email')
    #     signup_password_input = self.find_accessibility(
    #         'auth__signup-password')
    #     signup_telephone_input = self.find_accessibility(
    #         'auth__signup-telephone')
    #     signup_confirm_password_input = self.find_accessibility(
    #         'auth__signup-confirm-password')
    #     signup_first_name_input = self.find_accessibility(
    #         'auth__signup-firstname')
    #     signup_last_name_input = self.find_accessibility(
    #         'auth__signup-lastname')
    #     self.driver.set_value(signup_email_input, 'test@gmail.com')
    #     self.driver.set_value(signup_password_input, '1234abcd')
    #     self.driver.set_value(signup_confirm_password_input, '1234abcd')
    #     self.driver.set_value(signup_telephone_input, '8888888')
    #     self.driver.set_value(signup_first_name_input, '1234abcd')
    #     self.driver.set_value(signup_last_name_input, '1234abcd')

    # @timeout_decorator.timeout(LOCAL_TIMEOUT)
    # def test_no_menu_when_not_logged_in(self):
    #     menu_button = self.driver.find_elements_by_accessibility_id(
    #         "menu-button")
    #     self.assertEquals(menu_button, [])

    # @timeout_decorator.timeout(LOCAL_TIMEOUT)
    # def test_policies_exist(self):
    #     policies = ['travel', 'pa', 'pa_mr', 'pa_wi']
    #     for policy in policies:
    #         choice_el = self.find_accessibility(
    #             'purchase__policy-choice-'+policy)
    #     self.assertIsNotNone(choice_el)

    # @timeout_decorator.timeout(LOCAL_TIMEOUT)
    # def test_purchase_travel(self):
    #     travel_choice_el = self.find_accessibility(
    #         'purchase__policy-choice-travel')
    #     self.assertIsNotNone(travel_choice_el)
    #     self.tap_on(travel_choice_el)
    #     sleep(2)
    #     purchase_btn_el = self.find_accessibility(
    #         'purchase__policy-purchase-button')
    #     self.assertIsNotNone(purchase_btn_el)
    #     self.tap_on(purchase_btn_el)


if __name__ == "__main__":
    for cap in local_caps:
        current_cap = local_caps[cap]
        logging.basicConfig(stream=sys.stderr)
        logging.getLogger("AppiumTests").setLevel(logging.DEBUG)
        suite = unittest.TestLoader().loadTestsFromTestCase(AppiumTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
