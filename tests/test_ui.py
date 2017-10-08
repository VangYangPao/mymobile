# iOS environment
import os

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
                            'Products', 'Release-iphonesimulator',
                            'Microsurance.app')

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

    def tearDown(self):
        self.driver.quit()

    @timeout_decorator.timeout(LOCAL_TIMEOUT)
    def test_intro_works(self):
        sleep(2)
        logo_el = self.find_accessibility('intro__logo')
        self.assertIsNotNone(logo_el)
        sign_in_bottom_el = self.find_accessibility('intro__sign-in')
        for i in range(3):
            self.driver.swipe((100, 200), (300, 200))

    # @timeout_decorator.timeout(LOCAL_TIMEOUT)
    # def test_no_menu_when_not_logged_in(self):
    #     menu_button = self.driver.find_elements_by_accessibility_id(
    #         "menu-button")
    #     self.assertEquals(menu_button, [])

    @timeout_decorator.timeout(LOCAL_TIMEOUT)
    def test_policies_exist(self):
        policies = ['travel', 'pa', 'pa_mr', 'pa_wi']
        for policy in policies:
            choice_el = self.find_accessibility(
                'policy-choice-'+policy)
        self.assertIsNotNone(choice_el)

    @timeout_decorator.timeout(LOCAL_TIMEOUT)
    def test_purchase_travel(self):
        travel_choice_el = self.find_accessibility(
            'purchase__policy-choice-travel')
        self.assertIsNotNone(travel_choice_el)
        self.tap_on(travel_choice_el)
        sleep(2)
        purchase_btn_el = self.find_accessibility(
            'purchase__policy-purchase-button')
        self.assertIsNotNone(purchase_btn_el)
        self.tap_on(purchase_btn_el)


if __name__ == "__main__":
    for cap in local_caps:
        current_cap = local_caps[cap]
        suite = unittest.TestLoader().loadTestsFromTestCase(AppiumTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
