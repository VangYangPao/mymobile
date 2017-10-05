# iOS environment
import unittest
from appium import webdriver

desired_caps['platformName'] = 'iOS'
desired_caps['platformVersion'] = '10.3'
desired_caps['deviceName'] = 'iPhone 5s'
desired_caps['app'] = '/Users/hao/Desktop/Microsurance/ios/build/Build/Products/Debug-iphonesimulator/Microsurance.app'


class AppiumTests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)

    def tearDown(self):
        self.driver.quit()

    def testPurchaseTravel(self):
        self.driver.find_elements_by_accessibility_id('')
    
