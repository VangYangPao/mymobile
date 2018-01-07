# -*- coding: utf-8 -*-
import sys
import os
import unittest
import datetime
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from calendar import month_name

LOGIN_EMAIL = 'kendrick@microassure.com'
LOGIN_PASSWORD = '1234abcd'

THRESHOLD_SLEEP_TIME = 4

current_cap = {}

if os.environ.get('ENV') and os.environ.get('ENV') == 'dev':
    build_type = os.environ.get('BUILD_TYPE')

    if (build_type != 'release' and build_type != 'debug'):
        sys.exit()

    apk_type = 'app-debug.apk'
    if build_type == 'release':
        apk_type = 'app-release.apk'

    ipa_type = 'Debug-iphonesimulator'
    if build_type == 'release':
        ipa_type = 'Release-iphonesimulator'

    test_dir = os.path.dirname(os.path.realpath(__file__))
    root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))

    android_app_path = os.path.join(
        root_dir, 'android', 'app', 'build', 'outputs', 'apk', apk_type)

    ios_app_path = os.path.join(root_dir, 'ios', 'build', 'Build',
                                'Products', ipa_type,
                                'Microsurance.app')
    current_cap = {
        'platformName': 'iOS',
        'platformVersion': '10.3',
        'deviceName': 'iPhone 6',
        'app': ios_app_path
    }

#     local_caps = {
#         # 'android': {
#         #     'platformName': 'Android',
#         #     'platformVersion': '7.0',
#         #     'deviceName': 'Redmi',
#         #     'app': android_app_path
#         # },
#         # 'android': {
#         #     'platformName': 'Android',
#         #     'platformVersion': '6.0',
#         #     'deviceName': 'Redmi',
#         #     'app': android_app_path
#         # },
#         'iPhone 5s': {
#             'platformName': 'iOS',
#             'platformVersion': '10.3',
#             'deviceName': 'iPhone 5s',
#             'app': ios_app_path
#         }
#     }


class MicroUmbrellaAppTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://127.0.0.1:4723/wd/hub', current_cap)

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

    def poll_accessibility(
            self, selector, threshold_sleep_time=THRESHOLD_SLEEP_TIME):
        return self.poll_tree_until_found(
            self.driver.find_element_by_accessibility_id,
            selector, threshold_sleep_time)

    def poll_tree_until_found(
            self, function, selector,
            threshold_sleep_time=THRESHOLD_SLEEP_TIME):
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

    def select_date(self, date, start_date=datetime.datetime.now()):
        datepicker = None
        while True:
            datepicker = self.driver.find_elements_by_class_name(
                'XCUIElementTypePickerWheel')
            if len(datepicker) >= 3:
                break
            sleep(1)
        self.paginate_date_till_value(
            datepicker[2], start_date.year, date.year)
        self.paginate_date_till_value(
            datepicker[0], start_date.month, date.month, is_month=True)
        self.paginate_date_till_value(
            datepicker[1], start_date.day, date.day)
        sleep(3)
        self.tap_on(self.find_accessibility('Confirm'))

    def do_checkout(self):
        sleep(2)
        self.tap_on(self.find_accessibility('PROCEED'))
        sleep(5)
        self.tap_on(self.poll_accessibility('policy__purchase-btn'))
        card_number_input = self.poll_accessibility(
            'purchase__card-number-input')
        self.tap_on(card_number_input)
        sleep(2)
        self.driver.set_value(card_number_input, '4005550000000001')
        # with open('source.txt', 'w') as f:
        #     f.write(self.driver.page_source)
        expiry_input = self.poll_accessibility('purchase__expiry-input')
        # expiry_input = self.find_accessibility('purchase__expiry-input')
        self.tap_on(expiry_input)
        sleep(0.5)
        self.driver.set_value(expiry_input, '0121')
        sleep(0.5)
        cvc_input = self.poll_accessibility('purchase__cvc-input')
        self.tap_on(cvc_input)
        sleep(0.5)
        self.driver.set_value(cvc_input, '602')
        sleep(0.5)
        full_name_input = self.poll_accessibility(
            'purchase__card-name-input')
        self.tap_on(full_name_input)
        sleep(0.5)
        self.driver.set_value(full_name_input, 'Chan')
        self.hide_keyboard()
        sleep(2)
        self.tap_on(self.find_accessibility('purchase__confirm-purchase-btn'))
        self.tap_on(self.poll_accessibility('OK', 20))

    def login_user(self, email=LOGIN_EMAIL, password=LOGIN_PASSWORD):
        sleep(5)
        try:
            self.tap_on(self.find_accessibility('Allow'))
        except NoSuchElementException:
            pass
        sign_in_button = None
        try:
            sign_in_button = self.find_accessibility('intro__sign-in')
        except NoSuchElementException:
            # just skip login since there's no ability to login
            return None
        self.tap_on(sign_in_button)
        sleep(2)
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

    def send_composer_message(self, message):
        COMPOSER_PLACEHOLDER = 'Type your message here...'
        SEND_BUTTON = 'Send'
        composer = self.poll_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, message)
        sleep(0.5)
        self.tap_on(self.find_accessibility(SEND_BUTTON))

    def upload_documents(self, *image_ids):
        for i in range(len(image_ids)):
            image_id = image_ids[i]
            press_ok = i == 0
            self.select_image(image_id, press_ok=press_ok)
            sleep(1)
        self.tap_on(self.find_accessibility('UPLOAD IMAGES'))

    def select_image(self, image_id, press_ok=False):
        self.tap_on(self.poll_accessibility('chat__image-'+image_id))
        self.tap_on(self.poll_accessibility(u'Choose from Library…'))
        if press_ok:
            self.tap_on(self.poll_accessibility('OK'))
        sleep(2)
        # for i in range(100):
        #     print(i)
        #     self.driver.tap([(10, 10*i)])
        # self.driver.tap([(10, 700)])
        self.driver.tap([(10, 200)])
        # self.tap_on(self.poll_accessibility('Point Reyes National Seashore'))
        sleep(2)
        self.driver.tap([(10, 200)])
        # self.driver.tap([(10, 50)])

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

# if __name__ == '__main__':
#     for cap in local_caps:
#         current_cap = local_caps[cap]
#         logging.basicConfig(stream=sys.stderr)
#         logging.getLogger("PurchasePhoneTests").setLevel(logging.DEBUG)
#         suite = unittest.TestLoader()\
#             .loadTestsFromTestCase(PurchasePhoneTests)
#         unittest.TextTestRunner(verbosity=2).run(suite)
