import React, {forwardRef} from 'react'
import {StyleSheet} from 'react-native'
import Markdown from 'react-native-markdown-display'

import {BZModal} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

const PrivacyPolicyModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const privacyPolicy = `# **1.  Introduction**
    

If you are a merchant using Baze to power your business, or a Supplier or Retailer participating in Handshake, we collect and use your personal information to provide you with the use of our platform and its services, and generally to help you better manage your business and your relationship with your customers.

# **2. What information we collect about you and why**
    

2.1. We collect personal information when you sign up for Baze, when you use our platform, or when you otherwise provide us information. We may also use third party service providers to help us review accounts for fraud or other concerns. In general we need information about you for you to be able to use our platform. Below is a list of the information we collect from you and how we use it:

*   Information you provide us about you and your business, like your name, the name of your staff or other individuals associated with your business, company name, address, email address, and phone number.
    
    *   To provide you with the use of our platform and other related services (e.g., to confirm your identity, to contact you about issues with the platform, to invoice you)
        
    *   To advertise and market products or features to you
        
    *   To comply with legal requirements
        
    *   To prevent fraudulent use of our services
        
*   Payment information you provide us, such as your credit or debit card number or your bank account number.
    
    *   To provide you with the use of our platform and other related Services
        
    *   To charge for our Services or debt owing to us from you
        
*   Information about how you access Baze Websites, your account, and our platform, including information about the device and browser you use, your network connection, your IP address, and details about how you browse our Websites and platform and connected applications on our platform. We collect some of this information by using “cookies” or other similar technologies directly from your device.
    
    *   To provide you use of, and to improve, our platform and other related services (e.g., identifying ways to make our platform easier to use or navigate)
        
    *   To personalise the platform for you (e.g., by showing you products that we believe may be useful to you)
        
    *   To advertise and market products or features to you
        
    *   To prevent fraudulent use of our Services
        
*   Copies of government-issued or a picture of yourself holding your identification that you provide us.
    
    *   If we need to verify your identity (e.g., to protect you against identity theft or fraud)
        
    *   To verify that we are speaking with you if you contact us
        
    *   To help us determine or verify account ownership
        
    *   To comply with legal requirements
        
*   You may voluntarily disclose personal data revealing the racial or ethnic origin or sexual orientation of the business owner.
    
    *   To highlight collections of stores for the purpose of promoting diverse businesses
        

2.2. We also work with companies that provide us with information about merchants or prospective merchants (for example, to protect against fraud or if we’re sponsoring an event).

# **3. When and why we share your information with others**
    

3.1 We work with a variety of companies to help us provide you with a range of services to help you support your business. We sometimes share your personal information with these companies to help us provide you with Baze Services.

3.2 We also share your personal information with others:

*   to prevent or investigate suspected fraud, threats to physical safety, illegal activity, or violations of a contract (like our Terms of Service)
    
*   to help us conduct marketing and advertising
    
*   to comply with legal requirements, or to respond to court orders, or other similar government demands
    
*   pursuant to a corporate transaction
    

3.3 Additionally, almost every Merchant using the Baze platform also uses non-Baze services to support their business (for example, payment gateways, social media, or shipping providers). Baze doesn’t control how these services use your personal information, and you should review any other service you use to make sure it meets your privacy expectations.

# **4. Your rights over your information**
    

4.1 You can access and correct a lot of your personal information directly through your Baze Account. For information you are not able to access or correct directly within your Baze Account, please contact us at [support@trybaze.com](mailto:support@trybaze.com).

4.2 Because we need your personal information to provide Baze Services, we generally keep your personal information while you use Baze Services. If you close your Store, you stop paying your Subscription Fees, or we terminate your Account, we may retain Store information for two years before we begin the personal information purge process. We don’t do this immediately in case you reactivate your Account, or if there is a legal complaint or audit relating to your business. If you contact us to request deletion of your Store’s information, we will begin the personal information purge process after 90 days, except if we are legally required to retain specific information. Please keep in mind that after we anonymise your personal information, we may continue to use non-identifiable information to improve our Services.

# **5. Your customer's information**
    

5.1 In order to power your business, we collect and use personal information about your customers. In general, we only collect and use this personal information as directed by you, and as further described in our overall privacy policy.

5.2 Because you decide how the personal information of your customers will be used, you need to make sure your customers understand how you (and how we on your behalf) collect and process their personal information. You should do this by, at a minimum, posting a privacy policy on your Store that describes the information you collect, how you use it, and who you share it with. We may help get you started with this through our privacy policy generator.

5.3 Also, if you are collecting any “sensitive” personal information from your customers (for example, information about health, race, ethnicity, genetics, biometrics, trade union membership, political opinions, philosophical or religious beliefs, criminal history, or sexual interests), you should get the affirmative, express consent from your customers to use and process this information.`

  return (
    <BZModal ref={innerRef} title="Privacy Policy" snapPoints={['85%']}>
      <Markdown style={styles}>{privacyPolicy}</Markdown>
    </BZModal>
  )
})

const styles = StyleSheet.create({
  heading1: {
    fontSize: 16
  },
  heading2: {
    fontSize: 15
  },
  heading3: {
    fontSize: 15
  },
  heading4: {
    fontSize: 15
  },
  heading5: {
    fontSize: 15
  },
  heading6: {
    fontSize: 15
  },
  body: {
    fontSize: 13
  }
})

PrivacyPolicyModal.displayName = 'PrivacyPolicyModal'
export default PrivacyPolicyModal
