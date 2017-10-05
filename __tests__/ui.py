# iOS environment
import unittest
from time import sleep
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction

desired_caps = {}
desired_caps['platformName'] = 'iOS'
desired_caps['platformVersion'] = '10.3'
desired_caps['deviceName'] = 'iPhone 5s'
desired_caps['app'] =\
    '/Users/hao/Desktop/Microsurance/ios/build/Build/' + \
    'Products/Debug-iphonesimulator/Microsurance.app'


class AppiumTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub', desired_caps)
        self.find_accessibility = self.driver.find_element_by_accessibility_id

    def tap_on(self, el):
        action = TouchAction(self.driver)
        action.tap(el).perform()

    def tearDown(self):
        self.driver.quit()

    def test_no_menu_when_not_logged_in(self):
        menu_button = self.driver.find_elements_by_accessibility_id(
            "menu-button")
        self.assertEquals(menu_button, [])

    def test_policies_exist(self):
        policies = ['travel', 'pa', 'pa_mr', 'pa_wi']
        for policy in policies:
            choice_el = self.find_accessibility(
                'policy-choice-'+policy)
        self.assertIsNotNone(choice_el)

    def test_purchase_travel(self):
        travel_choice_el = self.find_accessibility('policy-choice-travel')
        self.assertIsNotNone(travel_choice_el)
        self.tap_on(travel_choice_el)
        sleep(2)
        purchase_btn_el = self.find_accessibility('policy-purchase-button')
        self.assertIsNotNone(purchase_btn_el)
        self.tap_on(purchase_btn_el)


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(AppiumTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
