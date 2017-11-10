import os
import sys
import logging
import unittest
from appium import webdriver
from datetime import date as create_date
from datetime import timedelta
from time import sleep
from uuid import uuid4

from mu_tests import MicroUmbrellaAppTest

test_dir = os.path.dirname(os.path.realpath(__file__))
root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))

current_cap = {}

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

if __name__ == "__main__":
    build_type = sys.argv[1]
    LOCAL_TIMEOUT = 10
    LOAD_TIME_MULTIPLY = 2
    if build_type == 'debug':
        LOAD_TIME_MULTIPLY = 1


class PurchaseTests(MicroUmbrellaAppTest):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub', current_cap)
        self.find_accessibility = self.driver.find_element_by_accessibility_id

    def test_purchase_travel_applicant(self):
        self.purchase_travel_policy(
            country_name='Macau', country_code=53,
            start_date=create_date(2017, 11, 10),
            duration=17, plan='enhanced')

    def purchase_travel_policy(
            self, country_name, country_code,
            start_date, duration, plan):
        sleep(3)
        signin_el = self.find_accessibility('intro__sign-in')
        self.tap_on(signin_el)
        sleep(2 * LOAD_TIME_MULTIPLY)
        self.login_user()
        sleep(2)
        menu_btn = self.find_accessibility('nav__menu-btn')
        self.assertIsNotNone(menu_btn)
        travel_policy_choice = self.find_accessibility(
            'purchase__policy-choice-travel')
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)
        sleep(3)
        COMPOSER_PLACEHOLDER = 'Type your message here...'
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        self.tap_on(self.find_accessibility(plan.upper()+'\nPLAN'))
        self.tap_on(self.find_accessibility('chat__select-plan_'+plan))
        sleep(2 * LOAD_TIME_MULTIPLY)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, country_name)
        sleep(0.5)
        country_suggestion = self.find_accessibility(
            'chat__suggestion-'+str(country_code))
        self.tap_on(country_suggestion)
        sleep(1 * LOAD_TIME_MULTIPLY)
        self.select_date(start_date)
        sleep(1 * LOAD_TIME_MULTIPLY)
        self.select_date(start_date + timedelta(days=duration))
        sleep(1.5 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.find_accessibility('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4()))
        self.tap_on(self.find_accessibility('Send'))
        sleep(1 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.find_accessibility('chat__submit-traveller'))
        sleep(0.5 * LOAD_TIME_MULTIPLY)
        self.tap_on(self.find_accessibility('PROCEED'))
        sleep(5)
        self.tap_on(self.find_accessibility('policy__purchase-btn'))
        sleep(2 * LOAD_TIME_MULTIPLY)
        # card_number_input = self.find_accessibility(
        #     'CARD NUMBER 1234 5678 1234 5678')
        card_number_input = self.find_accessibility(
            'purchase__card-number-input')
        self.tap_on(card_number_input)
        sleep(2)
        self.driver.set_value(card_number_input, '4005550000000001')
        sleep(2)
        # with open('source.txt', 'w') as f:
        #     f.write(self.driver.page_source)
        expiry_input = self.find_accessibility('purchase__expiry-input')
        # expiry_input = self.find_accessibility('purchase__expiry-input')
        self.tap_on(expiry_input)
        sleep(0.5)
        self.driver.set_value(expiry_input, '0121')
        sleep(0.5)
        cvc_input = self.find_accessibility('purchase__cvc-input')
        self.tap_on(cvc_input)
        sleep(0.5)
        self.driver.set_value(cvc_input, '602')
        sleep(0.5)
        full_name_input = self.find_accessibility(
            'purchase__card-name-input')
        self.tap_on(full_name_input)
        sleep(0.5)
        self.driver.set_value(full_name_input, 'Chan')
        sleep(0.5)
        self.tap_on(self.find_accessibility('purchase__confirm-purchase-btn'))
        sleep(20)


if __name__ == '__main__':
    for cap in local_caps:
        current_cap = local_caps[cap]
        logging.basicConfig(stream=sys.stderr)
        logging.getLogger("PurchaseTests").setLevel(logging.DEBUG)
        suite = unittest.TestLoader().loadTestsFromTestCase(PurchaseTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
