import os
import sys
import logging
import unittest
from appium import webdriver
import datetime
from datetime import date as create_date
from datetime import timedelta
from timeout_decorator import timeout
from time import sleep
from uuid import uuid4
from dateutil.relativedelta import relativedelta

from mu_tests import MicroUmbrellaAppTest

test_dir = os.path.dirname(os.path.realpath(__file__))
root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))

current_cap = {}

LOGIN_EMAIL = 'x@aa.com'
LOGIN_PASSWORD = '1234abcd'

if __name__ == '__main__':
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

    build_type = sys.argv[1]
    LOCAL_TIMEOUT = 10
    LOAD_TIME_MULTIPLY = 2
    if build_type == 'debug':
        LOAD_TIME_MULTIPLY = 1


class PurchasePhoneTests(MicroUmbrellaAppTest):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub', current_cap)

    def test_purchase_phone_1(self):
        brand = (1, 'apple')
        model = (1, 'iphone 5c')
        return self.purchase_phone_policy(
            brand, model, datetime.datetime.now())

    def test_purchase_phone_2(self):
        brand = (2, 'asus')
        model = (6, 'zenphone 2')
        return self.purchase_phone_policy(
            brand, model, datetime.datetime.now())

    @timeout(2 * 60)
    def purchase_phone_policy(self, brand, model, purchase_date):
        brand_id, brand_name = brand
        model_id, model_name = model

        signin_el = self.poll_accessibility('intro__sign-in')
        # signin_el = self.find_accessibility('intro__sign-in')
        self.tap_on(signin_el)
        self.login_user()
        # sleep(2)

        menu_btn = self.poll_accessibility('nav__menu-btn')
        self.assertIsNotNone(menu_btn)
        travel_policy_choice = self.poll_accessibility(
            'purchase__policy-choice-mobile')
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)

        COMPOSER_PLACEHOLDER = 'Type your message here...'
        IMEI_NUMBER = '999999999999999'
        SEND_BUTTON = 'Send'

        back_btn = self.poll_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)

        self.tap_on(self.poll_accessibility('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4())[:14])
        self.tap_on(self.find_accessibility(SEND_BUTTON))
        # sleep(1 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        sleep(1)
        self.driver.set_value(composer, IMEI_NUMBER)
        self.tap_on(self.find_accessibility(SEND_BUTTON))

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        sleep(0.5)
        self.driver.set_value(composer, brand_name)
        self.tap_on(self.poll_accessibility('chat__suggestion-'+str(brand_id)))

        self.tap_on(self.poll_accessibility(COMPOSER_PLACEHOLDER))
        sleep(0.5)
        self.driver.set_value(composer, model_name)
        self.tap_on(self.poll_accessibility('chat__suggestion-'+str(model_id)))

        self.tap_on(self.poll_accessibility('chat__datepicker'))
        sleep(1)
        self.select_date(datetime.datetime.now())

        self.do_checkout()


if __name__ == '__main__':
    for cap in local_caps:
        current_cap = local_caps[cap]
        logging.basicConfig(stream=sys.stderr)
        logging.getLogger("PurchasePhoneTests").setLevel(logging.DEBUG)
        suite = unittest.TestLoader()\
            .loadTestsFromTestCase(PurchasePhoneTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
