import React, {forwardRef} from 'react'
import {StyleSheet} from 'react-native'
import Markdown from 'react-native-markdown-display'

import {BZModal} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

const TOSModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const tos = `# **Introduction**

As used in these Terms of Service, “**we**”, “**us**”, “**our**” and “Baze” refers to Baze Software Technology Limited (RC7344902) with address registered to Workstation, Maryland Mall, 350-360 Ikorodu Rd, Maryland, Lagos state, Nigeria; and “**you**” means the Baze User (if registering for or using a Baze Service as an individual), or the business employing the Baze User (if registering for or using a Baze Service as a business) and any of its affiliates.

Baze provides a complete commerce platform that enables merchants to unify their commerce activities. Among other features, this platform includes a range of tools for merchants to build and customise online stores, sell in multiple places (including web, mobile, and social media (“**Online Services**”)), manage products, inventory, payments, business operations, and engage with existing and potential customers. Any such service or services offered by Baze are referred to in these Terms of Services as the “**Service(s)**”. Any new features or tools which are added to the current Services will also be subject to the Terms of Service.

By signing up for an account through the Baze application and accessing our Services, you are deemed a merchant (**“Merchant”**) and agree to these Merchant Terms of Service (the **“Agreement”** or **“Terms of Service”**). Your use of, and access to, the Services are subject at all times to the Agreement as well as our Terms of Use, Acceptable Use Policy (**“AUP”**), and our Privacy Policy, which are all incorporated by reference into this Agreement. Additionally, if you offer goods or services in relation to COVID-19, you must read, acknowledge and agree to the Rules of Engagement for Sale of COVID-19 Related Products, which is also incorporated by reference into this Agreement. You must read, agree with, and accept all of the terms and conditions contained or expressly referenced in this Agreement before you may sign up for a Baze Account or use any Baze Service. By using or accessing the Services, you represent that you have read and understood them and you agree to be bound by them. Capitalised terms used but not defined in this Agreement shall have the meanings set forth in the Terms of Use.

# **1. Account Terms**

1.1 To access and use the Services, you must register for a Baze account (**“Account”**). To complete your Account registration, you must provide us with your full legal name, business address, phone number, a valid email address, and any other information indicated as required (collectively, **“User Information”**). Baze may reject your application for an Account, or cancel an existing Account, for any reason, at our sole discretion.

1.2 You represent and warrant that all User Information you provide us from time to time is truthful, accurate, current, and complete, and you agree not to misrepresent your identity or your User Information. You agree to promptly notify us of changes to your User Information by updating your Baze Account.

1.3 You hereby authorize us to, directly or through a third-party, obtain, verify, and record information and documentation that helps us verify your identity and any User Information. By using the Services and providing User Information to us, you automatically authorize us to obtain, directly or indirectly through our third-party service providers and without any time limit or the requirement to pay any fees, information about you and your User Information from any institution, persons, authorities and other third-party websites and databases as necessary to provide the Services to you.

1.4 For purposes of the authorisation referred to in clause 1.3, you hereby grant Baze and our third-party service providers a limited power of attorney, and you hereby appoint Baze and our third-party service providers as your true and lawful attorney-in-fact and agent, with full power of substitution and resubstitution, for you and in your name, place, and stead, in any and all capacities, to access third-party websites, servers, and documents; retrieve information; and use your User Information, all as described above, with the full power and authority to do and perform each and every act and thing requisite and necessary to be done in connection with such activities, as fully to all intents and purposes as you might or could do in person. You acknowledge and agree that when Baze or our third-party service providers access and retrieve information from such third-party websites, Baze and our third-party service providers are acting as your agent, and not the agent or on behalf of the third party. You agree that other third parties shall be entitled to rely on the foregoing authorisation, agency, and power of attorney granted by you.

1.5 You must be the older of: (i) 18 years, or (ii) at least the age of majority in the jurisdiction where you reside and from which you use the Services to open an Account.

1.6 You confirm that you are receiving any Services provided by Baze for the purposes of carrying on a business activity and not for any personal, household or family purpose.

1.7 You acknowledge that Baze will use the email address you provide on opening an Account or as updated by you from time to time as the primary method for communication with you (**“Primary Email Address”**). You must monitor the Primary Email Address you provide to Baze, and your Primary Email Address must be capable of both sending and receiving messages. Your email communications with Baze can only be authenticated if they come from your Primary Email Address.

1.8 You are responsible for keeping your password secure. Baze cannot and will not be liable for any loss or damage from your failure to maintain the security of your Account and password. You therefore agree to (a) keep your password confidential, and (b) be responsible for any activity on your Account arising out of any failure to keep your password confidential, and that you may be held liable for any losses arising out of such a failure. Your Baze Account shall be used exclusively by you and you shall not transfer your Baze Account to any third party. If you authorise any third party to manage your Baze Account on your behalf, this shall be at your own risk.

1.9 You understand that technical support in respect of the Services is only provided to Baze Users.

1.10 You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Services, use of the Services, or access to the Services without the express written permission by Baze.

1.11 You agree not to work around, bypass, or circumvent any of the technical limitations of the Services, including to process orders outside Baze’s Checkout, use any tool to enable features or functionalities that are otherwise disabled in the Services, or decompile, disassemble or otherwise reverse engineer the Services.

1.12 You agree not to access the Services or monitor any material or information from the Services using any robot, spider, scraper, or other automated means.

1.13 You understand that your Materials may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. **“Materials”** means Your Trademarks, copyright content, any products or services you sell through the Services (including description and price), and any photos, images, videos, graphics, written content, audio files, code, information, or other data provided or made available by you or your affiliates to Baze or its affiliates.

1.14 We may suspend or cancel your Baze Account or edit your Baze Account details, at any time in our sole discretion and without notice or explanation, provided that if we cancel any Services you have paid for but not received, and you have not breached this Agreement, we will refund you in respect of the cancelled order.

# **2. Account Activation**
#
### Store Owner

2.1 Subject to clause 2.2, the person signing up for the Services by opening an Account will be the contracting party (**“Store Owner”**) for the purposes of these Terms of Service and will be the person who is authorized to use any corresponding Account we may provide to the Store Owner in connection with the Service. You are responsible for ensuring that the name of the Store Owner (including the legal name of the company that owns the Store, if applicable) is clearly visible on the Store’s website.

2.2 If you are signing up for the Services on behalf of your employer, your employer will be the Store Owner. If you are signing up for the Services on behalf of your employer, then you must use your employer-issued email address and you represent and warrant that you have the authority to bind your employer to our Terms of Service.

2.3 Your Baze Store can only be associated with one Store Owner. A Store Owner may have multiple Baze Stores. You agree to use Baze payment checkout for your store. **“Store”** means the online store (whether hosted by Baze or on a third party website), or physical retail location(s) associated with the Account.

# **3. Baze Rights**


3.1 The Services have a range of features and functionalities. Not all Services or features will be available to all Merchants at all times and we are under no obligation to make any Services or features available in any jurisdiction. Except where prohibited in these Terms of Service or by applicable law, we reserve the right to modify the Services or any part thereof for any reason, without notice and at any time.

3.2 Baze does not pre-screen Materials and it is in our sole discretion to refuse or remove any Materials from any part of the Services, including if we determine in our sole discretion that the goods or services that you offer through the Services, or the Materials uploaded or posted to the Services, violate our AUP, the Terms of Use or these Terms of Service.

3.3 Verbal or written abuse of any kind (including threats of abuse or retribution) of any Baze employee, member, or officer will result in immediate Account termination.

3.4 We reserve the right to provide our Services to your competitors and make no promise of exclusivity. You further acknowledge and agree that Baze employees and contractors may also be Baze customers or merchants and that they may compete with you, although they may not use your Confidential Information (as defined in clause 6) in doing so.

3.5 In the event of a dispute regarding Account ownership, we reserve the right to request documentation to determine or confirm Account ownership. Documentation may include, but is not limited to, a scanned copy of your business license, government issued photo ID, the last four digits of the credit card on file, or confirmation of your status as an employee of an entity.

3.6 Baze reserves the right to determine, in our sole discretion, rightful Account ownership and transfer an Account to the rightful Store Owner. If we are unable to reasonably determine the rightful Store Owner, without prejudice to our other rights and remedies, Baze reserves the right to temporarily suspend or disable an Account until resolution has been reached between the disputing parties.

3.7 The foregoing rights are not exhaustive of Baze’s rights.


# **4. Your Responsibilities**

4.1 You acknowledge and agree to provide amongst others public-facing contact information, a refund policy and order fulfilment timelines on your Baze Store.

4.2 You acknowledge and agree that the Services are not a marketplace, and any contract of sale made through the Services is directly between you and the customer. You are the seller of record for all items you sell through the Services. You are responsible for the creation and operation of your Baze Store, your Materials, the goods and services that you may sell through the Services, and all aspects of the transactions between you and your customer(s). This includes, but is not limited to, authorizing the charge to the customer in respect of the customer’s purchase, refunds, returns, fulfilling any sales or customer service, fraudulent transactions, required legal disclosures, regulatory compliance, alleged or actual violation of applicable laws (including but not limited to consumer protection laws in any jurisdiction where you offer products or services for sale), or your breach of these Terms of Service. You represent and warrant that your Store, your Materials and the goods and services you sell through the Services will be true, accurate, and complete, and will not violate any applicable laws, regulations or rights of third parties. For the avoidance of doubt, Baze will not be the seller or merchant or record and will have no responsibility for your Store or items sold to customers through the Services.

4.3 You are solely responsible for the goods or services that you may sell through the Services (including description, price, fees, tax that you calculate, defects, required legal disclosures, regulatory compliance, offers or promotional content), including compliance with any applicable laws or regulations.

4.4 You may not use the Baze Services for any illegal or unauthorised purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws), the laws applicable to you in your customer’s jurisdiction, or the laws of Nigeria and the State of Lagos. You will comply with all applicable laws, rules and regulations (including but not limited to obtaining and complying with the requirements of any license or permit that may be necessary to operate your store or that may be held by you) in your use of the Service and your performance of obligations under the Terms of Service.

4.5 You agree to use Baze Checkout for any sales associated with your online store. **“Baze Checkout”** means Baze’s checkout experience that allows customers to enter their shipping information and payment details after adding item(s) to their cart and before placing an order.

4.6 The foregoing are not exhaustive of your responsibilities.

# **5. Payment of Fees and Taxes**

5.1 You will pay the Fees applicable to your subscription to our Services (**“Subscription Fees”**) and any other applicable fees, including but not limited to applicable fees relating to the value of ordered processed through your Store or Account (**“Transaction Fees”**), and any fees relating to your purchase or use of any products or services such as Baze shipping, integrations, themes, domain names, or Third Party Services (**“Additional Fees”**). Together, the Subscription Fees, Transaction Fees and the Additional Fees are referred to as the “Fees”.

5.2 You must keep a valid payment method on file with us to pay for all incurred and recurring Fees. Baze will charge applicable Fees to any valid payment method that you authorise (**“Authorised Payment Method”**), and Baze will continue to charge the Authorised Payment Method for applicable Fees until the Services are terminated, and any and all outstanding Fees have been paid in full.

5.3 Subscription Fees are paid in advance and will be billed in 30 day intervals or such other period as we may communicate (each such date, a **“Billing Date”**). Transaction Fees and Additional Fees will be charged from time to time at Baze’s discretion. You will be charged on each Billing Date for all outstanding Fees that have not previously been charged. Fees will appear on an invoice, which will be sent to the Store Owner via the Primary Email Address provided. As well, an invoice will appear on the Account page of your Store’s administrative console. Users have approximately two weeks to bring up and settle any issues with the billing of Subscription Fees.

5.4 If we are not able to process payment of Fees using an Authorized Payment Method, we may make subsequent attempts to process payment using any Authorized Payment Method. If we are unable to successfully process payment of Fees using an Authorized Payment Method within 7 days of our initial attempt, we may suspend and revoke access to your Account and the Services. Your Account will be reactivated upon your payment of any outstanding Fees, plus the Fees applicable to your next billing cycle. You may not be able to access your Account or your storefront during any period of suspension. If the outstanding Fees remain unpaid for 20 days following the date of suspension, Baze reserves amongst other rights the right to terminate your Account.

5.5 All Fees are exclusive of applicable federal, provincial, state, local, or other governmental sales, goods and services, harmonized or other taxes, fees or charges now in force or enacted in the future (**“Taxes”**).

5.6 You are responsible for all applicable Taxes that arise from or as a result of your subscription to or purchase of Baze’s products and services. To the extent that Baze charges these Taxes, they are calculated using the tax rates that apply based on the billing address you provide to us. Such amounts are in addition to the Fees for such products and services and will be billed to your Authorized Payment Method. If you are exempt from payment of such Taxes, you must provide us with evidence of your exemption, which in some jurisdictions includes an original certificate that satisfies applicable legal requirements attesting to tax-exempt status. Tax exemption will only apply from and after the date we receive evidence satisfactory to Baze of your exemption. If you are not charged Taxes by Baze, you are responsible for determining if Taxes are payable, and if so, self-remitting Taxes to the appropriate tax authorities in your jurisdiction.

5.7 For the avoidance of doubt, all sums payable by you to Baze under these Terms of Service will be paid free and clear of any deductions or withholdings whatsoever. Other than Taxes charged by Baze to you and remitted to the appropriate tax authorities on your behalf, any deductions or withholdings that are required by law will be borne by you and paid separately to the relevant taxation authority. Baze will be entitled to charge the full amount of Fees stipulated under these Terms of Service to your Authorised Payment Method ignoring any such deduction or withholding that may be required.

5.8 You are solely responsible for determining, collecting, withholding, reporting, and remitting applicable taxes, duties, fees, surcharges and additional charges that arise from or as a result of any sale on your Baze Store or your use of the Services. The Services are not a marketplace. Any contract of sale made through the Services is directly between you and the customer.

5.9 You must maintain an accurate location in the administrative console of your Baze Application. If you change jurisdictions you must promptly update your location in the administrative console.

5.10 We may at our sole discretion introduce new Services and modify some or all of the existing Services offered on our Website. In such an event, we reserve, without notice to you, the right to introduce charges for the new Services offered or amend or introduce fees for existing Services, as the case may be. You shall be solely responsible for compliance with all applicable laws including those in Nigeria for making payments to us.

# **6. Confidentiality**


6.1 “Confidential Information” will include, but will not be limited to, any and all information associated with a party’s business and not publicly known, including specific business information, technical processes and formulas, software, customer lists, prospective customer lists, names, addresses and other information regarding customers and prospective customers, product designs, sales, costs (including any relevant processing fees), price lists, and other unpublished financial information, business plans and marketing data, and any other confidential and proprietary information, whether or not marked as confidential or proprietary. Baze’s Confidential Information includes all information that you receive relating to us, or to the Services, that is not known to the general public including information related to our security program and practices.

6.2 Confidential Information will not include any information that the receiving party can prove: (A) was already in the public domain, or was already known by or in the possession of the receiving party, at the time of disclosure of such information; (B) is independently developed by the receiving party without use of or reference to the other party’s Confidential Information, and without breaching any provisions of these Terms of Service; or (C) is thereafter rightly obtained by the receiving party from a source other than the disclosing party without breaching any provision of these Terms of Service.

6.3 Each party agrees to use the other party’s Confidential Information solely as necessary for performing its obligations under these Terms of Service and in accordance with any other obligations in these Terms of Service including this clause 6.

6.4 Each party agrees that it will take all reasonable steps, at least substantially equivalent to the steps it takes to protect its own proprietary information, to prevent the duplication, disclosure or use of any such Confidential Information, other than (i) by or to its employees, agents and subcontractors who must have access to such Confidential Information to perform such party’s obligations hereunder, who each will treat such Confidential Information as provided herein, and who are each subject to obligations of confidentiality to such party that are at least as stringent as those contained herein; or (ii) as required by any law, regulation, or order of any court of proper jurisdiction over the parties and the subject matter contained in these Terms of Service, provided that, if legally permitted, the receiving party will give the disclosing party prompt written notice and use commercially reasonable efforts to ensure that such disclosure is accorded confidential treatment.

# **7. Your Consent to Use Electronic Signatures and Communications**

7.1 To the extent permitted by any applicable law, you consent to use electronic signatures and to electronically receive all records, notices, statements, communications, and other items for all Services provided to you under these Terms of Service and in connection with your relationship with us (collectively, **“Communications”**) that we may otherwise be required to send or provide you in paper form (e.g., by mail). By accepting and agreeing to these Terms electronically, you represent that: (a) you have read and understood this consent to use electronic signatures and to receive Communications electronically; (b) you satisfy the minimum requisite hardware and software requirements; and (c) your consent will remain in effect until you withdraw your consent.

7.2 If you withdraw your consent to receive Communications electronically, we may close your Baze Account and you will no longer be able to use your Baze Account or the Services, except as expressly provided in these Terms. Any withdrawal of your consent to receive Communications electronically will be effective only after we have a reasonable period of time to process your withdrawal. Please note that withdrawal of your consent to receive Communications electronically will not apply to Communications electronically provided by us to you before the withdrawal of your consent becomes effective.

7.3 In order to ensure that we are able to provide Communications to you electronically, you must notify us of any change in your Primary Email Address and your mobile device number or other text message address by updating your profile on the Website.

7.4 We reserve the right, in our sole discretion, to communicate with you in paper form. In addition, we reserve the right, in our sole discretion, to discontinue the provision of electronic Communications or to terminate or change the terms and conditions on which we provide electronic Communications. Except as otherwise required by applicable law, we will notify you of any such termination or change by updating these Terms of Service on the Website or delivering notice of such termination or change electronically.

# **8. Your Materials**


8.1 In these Terms of Service, “Materials” includes all works and materials (including without limitation text, graphics, images, audio material, video material, audio-visual material, scripts, software and files) that you submit to us for storage or publication, processing by, or onward transmission; and all communications on, or through, the Services, including product reviews, feedback and comments.

8.2 Materials must be accurate, complete and truthful. Materials must be appropriate, civil, and accord with generally accepted standards of etiquette and behaviour on the internet, and must not (a) be offensive, obscene, indecent, pornographic, lewd, suggestive or sexually explicit; (b) depict violence in an explicit, graphic or gratuitous manner; or (c) be blasphemous, in breach of racial or religious hatred or discrimination legislation; (d) be deceptive, fraudulent, threatening, abusive, harassing, anti-social, menacing, hateful, discriminatory or inflammatory; or (e) cause annoyance, inconvenience or needless anxiety to any person; or constitute spam.

8.3 Materials must not be illegal or unlawful, infringe any person's legal rights, or be capable of giving rise to legal action against any person (in each case in any jurisdiction and under any applicable law). Materials must not infringe or breach (a) any copyright, moral right, database right, trademark right, design right, right in passing off or other intellectual property right; (b) any right of confidence, right of privacy or right under data protection legislation; (c) any contractual obligation owed to any person; or (d) any court order.

8.4 You must not use our Service to link to any website or web page consisting of or containing material that would, were it posted on our Website, breach the provisions of these Terms. You shall not use the review function or any other form of communication to provide inaccurate, inauthentic or fake reviews.

8.5 We may periodically review Materials and we reserve the right to remove any content in our discretion for any reason whatsoever. If you learn of any unlawful material or activity relating to our Service, or any material or activity that breaches these Terms of Service, you may inform us by contacting us as indicated below.

8.6 Materials must be your own and must not be invading any third-party's rights. Baze reserves the right to remove any of Materials at any time without notice. You are however responsible for Materials. This means you assume all risks related to it, including someone else’s reliance on its accuracy or claims relating to intellectual property or other legal rights. You agree that you will indemnify, defend and hold harmless Baze for all claims resulting from Materials. But we reserve the right to assume the exclusive defence and control of such disputes, and in any event, you will cooperate with us in asserting any available defences.

# **9. Our rights to use Materials**

9.1 We do not claim ownership of the Materials you provide to Baze or Materials; however, we do require a license to those Materials.

9.2 You grant to us a worldwide, irrevocable, non-exclusive, transferable, sub-licensable, royalty-free license and right to use, reproduce, store, adapt, publish, translate and distribute Materials across our marketing channels and any existing or future media. You grant to us the right to bring an action for infringement of these rights. You hereby waive all your moral rights in Materials to the maximum extent permitted by applicable law, and you warrant and represent that all other moral rights in Materials have been waived to the maximum extent permitted by applicable law. Without prejudice to our other rights under these Terms, if you breach our rules on content in any way, or if we reasonably suspect that you have breached our rules on content, we may delete, unpublish or edit any or all of Materials.

9.3 If you owned the Materials before providing them to Baze then, despite uploading them to your Baze Store they remain yours, subject to any rights or licenses granted in the Terms of Service or elsewhere. You can remove your Baze Store at any time by deleting your Account. Removing your Baze Store does not terminate any rights or licenses granted to the Materials that Baze requires to exercise any rights or perform any obligations that arose during the Term.

9.4 You agree that Baze can, at any time, review and delete any or all of the Materials submitted to the Services, although Baze is not obligated to do so.

9.5 You grant Baze a non-exclusive, transferable, sub-licensable, royalty-free, worldwide right and license to use the names, trademarks, service marks and logos associated with your Store (**“Your Trademarks”**) to operate, provide, and promote the Services and to perform our obligations and exercise our rights under the Terms of Service. This license will survive any termination of the Terms of Service solely to the extent that Baze requires the license to exercise any rights or perform any obligations that arose during the Term. Baze’s use of Your Trademarks to promote the Services does not imply an endorsement of your products and services.

# **10. Services**


10.1 Unless otherwise specified, the Services on the Website are presented solely for the purpose of sale or provision of goods and services in Nigeria. We make no representation that products or services on the Website are appropriate or available for use in other locations or countries other than Nigeria. Those who choose to access the Website from other locations or countries outside Nigeria do so on their own volition and we will not be responsible for supply of products or availability or unavailability of Services in other locations or countries other than Nigeria, compliance with local laws, if and to the extent local laws are applicable.

10.2 We endeavour to be as accurate as possible. However, we do not warrant that the description of the products or Services or other content of the Website is accurate, complete, reliable, current, or error-free.

10.3 If we come across any difference in pricing resulting from typographic errors with regards to pricing or products or Service information, we shall have the right to rectify same or cancel the order(s) and refund monies, if any, collected from you within 5 business days of such corrective action taken.

# **11. Payments**


11.1 You shall select a method of payment from the list of available payment methods provided on the Services, which may include but is not limited to bank transfer, Visa, MasterCard, etc. You agree that payments to Baze or through the Services may be facilitated or processed through a payment gateway such as Paystack or Flutterwave. Each payment gateway and Visa, MasterCard, Verve, or any other electronic funds transfer network (each, a **“Card Network”**) has its own rules, regulations and guidelines. You are required to comply with all applicable payment Network Rules.

11.2 While availing any of the payment method(s) offered on the Website, we will not be responsible or assume any liability whatsoever, in respect of any loss or damage arising directly or indirectly to you due to (a) the unauthorization of any transaction(s), (b) exceeding the preset limit mutually agreed between you and your bank or financial institution, (c) any payment issues arising out of the transaction, or (d) a decline of transaction for any other reasons.

11.3 Payments in Naira are remitted into your designated Naira bank account by the next business day following the day the payment was received.

11.4 All payments are non-refundable except as may be expressly provided otherwise herein.

# **12. Refunds**


In the event of our failure to deliver the Services under circumstances for which we are solely responsible, we may offer refunds for amounts, in our discretion in respect of our Fees, by way of store credits, vouchers, mobile money transfer, bank transfers or such other method as we may determine from time to time in our sole discretion. Bank charges shall be deducted from all refunds before they are made. Where orders are cancelled by you, you may not be refunded as we may have applied the funds to the payment of other service providers working with or for Baze.

# **13. Intellectual property**

13.1 Subject to the express provisions of these Terms of Services, we, together with our licensors, own and control all the copyright, trademarks and other intellectual property rights in our Website and the Services, and all rights in materials on our Website are reserved. Baze’s logos and our other registered and unregistered trademarks are trademarks belonging to us. We give no permission for the use of these trademarks, and such use may constitute an infringement of our rights. The third-party registered and unregistered trademarks or service marks on our website are the property of their respective owners and we do not endorse and are not affiliated with any of the holders of any such rights and as such, we cannot grant any license to exercise such rights. We do not grant any right or license to any Baze intellectual property rights by implication, estoppel or otherwise, other than those expressly granted in these Terms.

13.2 You agree that you may not use any trademarks, logos, or service marks of Baze, whether registered or unregistered, including but not limited to the word mark Baze, and the Baze logo (**“Baze Trademarks”**) unless you are authorised to do so by Baze in writing. You agree not to use or adopt any marks that may be considered confusing with the Baze Trademarks. You agree that any variations or misspellings of the Baze Trademarks would be considered confusing with the Baze Trademarks.

13.3 You agree not to purchase, register, or use search engine or other pay-per-click keywords (such as Google Ads), trademarks, email addresses, social media names, or domain names (including without limitation top-level domains, sub-domains, and page URLs) that use or include Baze or Baze Trademarks or that use or include any terms that may be confusing with the Baze Trademarks.

13.4 You acknowledge and agree that the Terms of Service do not give you any right to implement Baze patents.

# **14. Additional Services**

### Third Party Services

14.1 Baze may from time to time recommend, provide you with access to, or enable third party software, applications, products, services or website links (collectively, **“Third Party Services”**) for your consideration or use. Such Third Party Services are made available only as a convenience, and your purchase, access or use of any such Third Party Services is solely between you and the applicable third party services provider (**“Third Party Provider”**). In addition to these Terms of Service, you also agree to be bound by the additional service-specific terms applicable to services you purchase from, or that are provided by, Third Party Providers.

14.2 Any use by you of Third Party Services offered through the Services or Baze’s Website is entirely at your own risk and discretion, and it is your responsibility to read the terms and conditions and/or privacy policies applicable to such Third Party Services before using them. In some instances, Baze may receive a revenue share from Third Party Providers that Baze recommends to you or that you otherwise engage through your use of the Services or Baze’s Website.

14.3 We do not provide any warranties or make representations to you with respect to Third Party Services. You acknowledge that Baze has no control over Third Party Services and will not be responsible or liable to you or anyone else for such Third Party Services. The availability of Third Party Services on Baze’s Website or the integration or enabling of such Third Party Services with the Services does not constitute or imply an endorsement, authorisation, sponsorship, or affiliation by or with Baze. Baze does not guarantee the availability of Third Party Services and you acknowledge that Baze may disable access to any Third Party Services at any time in its sole discretion and without notice to you. Baze is not responsible or liable to anyone for discontinuation or suspension of access to, or disablement of, any Third Party Service. Baze strongly recommends that you seek specialist advice before using or relying on Third Party Services, to ensure they will meet your needs. In particular, tax calculators should be used for reference only and not as a substitute for independent tax advice, when assessing the correct tax rates you should charge to your customers.

14.4 If you install or enable a Third Party Service for use with the Services, you grant us permission to allow the applicable Third Party Provider to access your data and other Materials and to take any other actions as required for the interoperation of the Third Party Service with the Services, and any exchange of data or other Materials or other interaction between you and the Third Party Provider is solely between you and such Third Party Provider. Baze is not responsible for any disclosure, modification or deletion of your data or other Materials, or for any corresponding losses or damages you may suffer, as a result of access by a Third Party Service or a Third Party Provider to your data or other Materials.

14.5 Meta is a Third Party Service that is used within the Services. You acknowledge and agree that: (i) by linking or enabling Meta to or on your Account, you consent to being contacted by one or more of your Meta accounts; and (ii) Baze will receive all communications exchanged via Meta between yourself and others. The same applies to Google. Your use of the Services is subject to your acceptance of the requisite respective Meta and Google terms of service as they may be amended by Google from time to time.

14.6 The relationship between you and any Third Party Provider is strictly between you and such Third Party Provider, and Baze is not obligated to intervene in any dispute arising between you and a Third Party Provider.

14.7 Under no circumstances will Baze be liable for any direct, indirect, incidental, special, consequential, punitive, extraordinary, exemplary or other damages whatsoever, that result from any Third Party Services or your contractual relationship with any Third Party Provider. These limitations will apply even if Baze has been advised of the possibility of such damages. The foregoing limitations will apply to the fullest extent permitted by applicable law.

14.8 You agree to indemnify and hold us and (as applicable) our parent, subsidiaries, affiliates, Baze partners, officers, directors, agents, employees, and suppliers harmless from any claim or demand, including reasonable attorneys’ fees, arising out of your use of a Third Party Service or your relationship with a Third Party Provider.

### Beta Services

14.9 From time to time, Baze may, in its sole discretion, invite you to use, on a trial basis, pre-release or beta features that are in development and not yet available to all merchants (**“Beta Services”**). Beta Services are not part of the Services, and Beta Services may be subject to additional terms and conditions, which Baze will provide to you prior to your use of the Beta Services. Such Beta Services and all associated conversations and materials relating thereto will be considered Baze Confidential Information and subject to the confidentiality provisions in this Agreement. Without limiting the generality of the foregoing, you agree that you will not make any public statements or otherwise disclose your participation in the Beta Services without Baze’s prior written consent. Baze makes no representations or warranties that the Beta Services will function. Baze may discontinue the Beta Services at any time in its sole discretion. Baze will have no liability for any harm or damage arising out of or in connection with a Beta Service. The Beta Services may not work in the same way as a final version. Baze may change or not release a final or commercial version of a Beta Service in our sole discretion.

# **15. Know Your Customer**

You agree that you are solely responsible for verifying the identities of your customers and persons you may conduct business with using our Services, ensuring that they are authorised to carry out the transactions with you, and determining their eligibility to purchase your products and services. You are also required to maintain information and proof of service or product delivery to your customer. You may be required, and agree when required, to provide Baze with these.

# **16. Disclaimers and Limitation of liability**

16.1 The limitations and exclusions of liability set out in these Terms govern all liabilities arising under these Terms or relating to the subject matter of these Terms, including liabilities arising in contract, in tort (including negligence) and for breach of statutory duty, except to the extent expressly provided otherwise in these Terms.

16.2 THE WEBSITE, ALL THE MATERIALS AND PRODUCTS (INCLUDING BUT NOT LIMITED TO SOFTWARE) AND THE SERVICES, INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU THROUGH THE WEBSITE ARE PROVIDED ON “AS IS” AND “AS AVAILABLE” BASIS WITHOUT ANY REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, EXCEPT OTHERWISE EXPRESSLY SPECIFIED IN WRITING. WITHOUT PREJUDICE TO THE FOREGOING, WE DO NOT WARRANT THAT: (A) THE WEBSITE OR SERVICES WILL BE CONSTANTLY AVAILABLE, OR AVAILABLE AT ALL; OR (B) THE INFORMATION ON THE WEBSITE OR SERVICES IS COMPLETE, TRUE, ACCURATE OR NON-MISLEADING. WE WILL NOT BE LIABLE TO YOU IN ANY WAY OR IN RELATION TO THE CONTENTS OF, OR USE OF, OR OTHERWISE IN CONNECTION WITH THE WEBSITE OR SERVICES.

16.3 We do not warrant that the Website, information, content, materials, product (including software) or services included on or otherwise made available to you through the Website, servers, or electronic Communications sent from us are free from viruses or other harmful components. Nothing on the Website or the Services constitutes, or is meant to constitute, advice of any kind.

16.4 Baze does not warrant that the results that may be obtained from the use of the Services will be accurate or reliable.

16.5 Baze is not responsible for any of your tax obligations or liabilities related to the use of Baze’s Services.

16.6 Baze does not warrant that the quality of any products, services, information, or other materials purchased or obtained by you through the Services will meet your expectations, or that any errors in the Services will be corrected.

16.7 Notwithstanding the above, we will not be liable to you for any loss or damage of any nature, including in respect of (a) any losses occasioned by any interruption of or disfunction to the Website or Services; (b) any losses arising out of any event or events beyond our reasonable control; (c) any business losses, including (without limitation) loss of or damage to profits, income, revenue, use, production, anticipated savings, business, contracts, commercial opportunities or goodwill; (d) any loss or corruption of any data, database or software; or (e) any special, indirect or consequential loss or damage.

16.8 We accept that we have an interest in limiting the personal liability of our officers and employees and, having regard to that interest, you acknowledge that we are a limited liability company. You agree that you will not bring any claim personally against our officers or employees in respect of any losses you suffer in connection with the Website, the Services or these Terms. Our Website includes hyperlinks to other websites owned and operated by third parties; such hyperlinks are not recommendations. We have no control over third party websites and their contents, and we accept no responsibility for them or for any loss or damage that may arise from your use of them.

16.9 NOTHING IN THESE TERMS LIMITS OR EXCLUDES OUR LIABILITY TO THE EXTENT THAT IT CANNOT BE LEGALLY LIMITED OR EXCLUDED BY APPLICABLE LAW. SUBJECT TO THIS QUALIFICATION, BAZE SHALL NOT, UNDER ANY CIRCUMSTANCES, BE LIABLE TO YOU WHETHER IN CONTRACT (INCLUDING UNDER AN INDEMNITY OR WARRANTY), IN TORT (INCLUDING NEGLIGENCE), FOR BREACH OF STATUTORY DUTY, OR OTHERWISE, ARISING UNDER OR IN CONNECTION WITH THESE TERMS FOR: LOSS OF PROFITS; LOSS OF REVENUE; LOSS OF ANTICIPATED SAVINGS; LOSS, DESTRUCTION OR CORRUPTION OF DATA; LOSS OF CONTRACT OR BUSINESS OPPORTUNITY; LOSS OF GOODWILL; MALFUNCTION; DELAYS; INTERRUPTION OF SERVICES; THIRD-PARTY CLAIMS FOR DAMAGES AGAINST YOU; OR INDIRECT OR CONSEQUENTIAL LOSSES OF ANY KIND WHATSOEVER AND HOWEVER CAUSED, WHETHER OR NOT REASONABLY FORESEEABLE, REASONABLY CONTEMPLATABLE, OR ACTUALLY FORESEEN OR ACTUALLY CONTEMPLATED, BY BAZE AT THE TIME OF ENTERING INTO THESE TERMS. AND IN NO EVENT SHALL BAZE’S CUMULATIVE LIABILITY EXCEED THE TOTAL PRICE PAID BY YOU FOR A SERVICE AND IF NO PAYMENT HAS BEEN MADE BY YOU, BAZE’S CUMULATIVE LIABILITY SHALL NOT EXCEED 10,000 NAIRA.

16.10 Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain damages. Accordingly, some of the above disclaimers and limitations of liability may not apply to you. To the extent that Baze may not, as a matter of applicable law, disclaim any implied warranty or limit its liabilities, the scope and duration of such warranty and the extent of Baze’s liability shall be the minimum permitted under such applicable law.

# **17. Representation and Warranties**

You represent and warrant to Baze that you and or your business: (a) have full power and authority to enter into, execute, deliver and perform these Terms; and (b) are duly organised, authorised and in good standing under the laws of the Federal Republic of Nigeria or under the laws of any state, region or country of your organisation and are duly authorised to do business in all other states, regions or countries in which your business operates.

# **18. Indemnification**


18.1 You hereby indemnify us, and undertake to keep us indemnified, against any and all losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by us to any third party in settlement of a claim or dispute) incurred or suffered by us and arising directly or indirectly out of (a) your breach of these Terms of Service or the documents it incorporates by reference (including the AUP); (b) your violation of any law or the rights of a third party; (c) any aspect of the transaction between you and your customer, including but not limited to refunds, fraudulent transactions, alleged or actual violation of applicable laws (including but not limited to Federal and State consumer protection laws), or your breach of the Terms of Service; or (d) any VAT liability or other tax liability that we may incur in relation to any sale, supply or purchase that you make through our Services.

18.2 You will be responsible for any breach of the Terms of Service by your affiliates, agents or subcontractors and will be liable as if it were your own breach.

# **19. Breach of the Terms**

19.1 If you breach these Terms, or if we reasonably suspect that you have breached these Terms in any way, we may (with or without notice to you) also take such actions as we deem appropriate to mitigate risk to Baze and any impacted third parties and to ensure compliance with these Terms including contacting and disclosing information related to such violations to (i) persons who have sold or purchased goods or services from you, (ii) any banks or Card Networks involved with your business or transactions, (iii) law enforcement or regulatory agencies, and (iv) other third parties that may have been impacted by such violations.

19.2 Where we suspend, prohibit or block your access to our Website or a part of our Services, you must not take any action to circumvent such suspension or prohibition or blocking (including without limitation creating or using a different account).

# **20. Feedback and Reviews**

Baze welcomes any ideas or suggestions regarding improvements or additions to the Services. Under no circumstances will any disclosure of any idea, suggestion or related material or any review of the Services, Third Party Services or any Third Party Provider (collectively, “Feedback”) to Baze be subject to any obligation of confidentiality or expectation of compensation. By submitting Feedback to Baze (whether submitted directly to Baze or posted on any Baze hosted forum or page), you waive any and all rights in the Feedback and that Baze is free to implement and use the Feedback if desired, as provided by you or as modified by Baze, without obtaining permission or license from you or from any third party. Any reviews of a Third Party Service or Third Party Provider that you submit to Baze must be accurate to the best of your knowledge, and must not be illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties or objectionable. Baze reserves the right (but not the obligation) to remove or edit Feedback of Third Party Services or Third Party Providers, but does not regularly inspect posted Feedback.

# **21. Term and Termination**

21.1 The term of these Terms of Service will begin on the date of your completed registration for use of a Service and continue until terminated by us or by you, as provided below (the **“Term”**).

21.2 You may cancel your Account and terminate the Terms of Service at any time by contacting Baze Support and then following the specific instructions indicated to you in Baze’s response.

21.3 Without limiting any other remedies, we may suspend or terminate your Account or the Terms of Service for any reason, without notice and at any time (unless otherwise required by law), including if we suspect that you (by conviction, settlement, insurance or escrow investigation, or otherwise) have engaged in fraudulent activity in connection with the use of the Services. Termination of the Terms of Service will be without prejudice to any rights or obligations which arose prior to the date of termination.

21.4 We reserve the absolute right to modify, discontinue, temporarily or permanently, any and all portion of our Services with or without prior communications. You hereby consent that we will under no circumstance be liable to you or any third party for any modification or discontinuance of availability of Services.

21.5 Upon termination of the Services by either party for any reason:

*   Baze will cease providing you with the Services and you will no longer be able to access your Account
    
*   Unless otherwise provided in the Terms of Service, you will not be entitled to any refunds of any Fees, pro rata or otherwise
    
*   Any outstanding balance owed to Baze for your use of the Services through the effective date of such termination will immediately become due and payable in full; and
    
*   Your Baze Store will be taken offline.
    

21.6 On termination, all related rights and obligations under the Terms of Service immediately terminate, except that (a) you will remain responsible for performing all of your obligations in connection with transactions entered into before termination and for any liabilities that accrued before or as a result of termination; and (b) clause 1 (Account Terms), 5 (Payment of Fees), 6 (Confidentiality), 8 (Your Materials), 9 (Our rights to your Materials), 13 (Intellectual Property), 14.1-14.8 (Third Party Services), 16 (Disclaimers and Limitation of Liability), 18 (Indemnification), 19 (Breach of the Terms), 20 (Feedback and Reviews), 21 (Term and Termination), and 22 (Miscellaneous) will survive the termination or expiration of these Terms of Service.

21.7 If you purchased a domain name through Baze, upon cancellation your domain will no longer be automatically renewed. Following termination, it will be your sole responsibility to handle all matters related to your domain with the domain provider.

# **22. Miscellaneous**


### Entire agreement

22.1 These Terms, together with the documents it expressly incorporates by reference and the documents those documents expressly incorporate by reference (the “Agreements”), constitute the entire agreement between Baze and you and supersede all prior or contemporaneous arrangements, proposals, oral or written, understandings, representations, conditions, warranties, and all other communications between Baze and you relating to the subject matter of any contract to the fullest extent permitted by law. These Terms may not be explained or supplemented by any prior course of dealings or trade, or by custom or usage. The Agreements shall be read as one document and shall be interpreted to harmonize, and not conflict, with each other.

22.2 Unless the context otherwise requires, all the documents incorporated by reference and the documents they expressly incorporate form an integral part of this Agreement and of one another. Capitalized terms used but not defined in this Agreement or in any of the Agreements shall have the meanings set forth in any of the other Agreement. Where any term is defined more than once in the Agreements, the definitions shall be read together and interpreted as complementing each other or if the context requires, separately.

### Interpretation

22.3 The rule of construction to the effect that ambiguities are to be resolved against the drafting Party shall not be employed in the interpretation of these Terms. Further, the ejusdem generis rule of construction shall not apply and accordingly, the meaning of general words is not to be restricted by any particular examples preceding or following those general words. The headings of the several clauses of this Agreement are inserted solely for convenience of reference and in no way define, describe, limit, extend or aid in the construction of the scope, extent, or intent of this Agreement or any term or provision hereof.

22.4 Unless otherwise specified, in this Agreement:

*   Where the context so admits, words indicating the singular also include the plural and vice-versa and words indicating one gender include all genders;
    
*   Any reference to a statute or statutory provision includes a reference to that provision as amended, re-enacted or replaced and any regulations or orders made under such provisions from time to time whether before on or after the date of this Agreement;
    
*   A reference to another agreement or other instrument shall be construed as a reference to that other agreement, deed or other instrument, as the same may have been, or may from time to time be, modified;
    
*   A reference to “person” includes any individual, partnership, firm, company, corporation (statutory or otherwise), joint venture, trust, association, organisation or other entity, in each case whether or not having separate legal personality and words importing persons shall also import all such entities; and
    
*   Reference to “clause” or “sub-clause” means a clause or sub-clause of this Agreement.

#####
    

### Force Majeure

22.5 Baze’s failure or delay in the performance of an obligation under these Terms shall not be a breach if such failure or delay is due to Force Majeure Events. **“Force Majeure Events”** include acts of God or public enemy, acts of federal, state or local government, earthquake, flood, hurricane, fire, epidemic, pandemic, freight embargoes, war or any other event beyond the reasonable control of Baze.

### Assignment

22.6 Baze is allowed to assign, transfer, and subcontract its rights and obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights or obligations under these Terms.

### Amendment and Modifications

22.7 We may revise these Terms, and our policies and guidelines from time to time as we see fit.

22.8 We reserve the right, in our sole and absolute discretion, to update or change any portion of the Terms of Service at any time. We will endeavour to provide you with reasonable advance notice of changes to the Terms of Service that materially adversely affect your use of the Services or your rights under the Terms of Service by sending an email to the Primary Email Address, providing notice through the Baze administrative console, or by other similar means. However, Baze may make changes that materially adversely affect your use of the Services or your rights under the Terms of Service at any time and with immediate effect (i) for legal, regulatory, fraud and abuse prevention, or security reasons; or (ii) to restrict products or activities that we deem unsafe, inappropriate, or offensive. Unless we indicate otherwise in our notice (if applicable), any changes to the Terms of Service will be effective immediately upon posting of such updated terms at this location. Your continued access to or use of the Services after we provide such notice, if applicable, or after we post such updated terms, constitutes your acceptance of the changes and consent to be bound by the Terms of Service as amended. If you do not agree to the amended Terms of Service, you must stop accessing and using the Services.

22.9 Baze may change the Fees for the Services from time-to-time. Baze will not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Services (or any part thereof).

### Severability

22.10 Every provision of these Terms is distinct and severable. If a provision of these Terms is determined by any court or other competent authority to be unlawful or unenforceable, the other provisions will continue in effect. If any unlawful or unenforceable provision of these Terms would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision shall continue in effect.

### Governing Law and Jurisdiction

22.11 These Terms of Service shall be governed by and construed in accordance with the laws in force in Lagos State of the Federal Republic of Nigeria and the courts of Lagos State of Nigeria shall have exclusive jurisdiction to entertain disputes arising out of these Terms.

22.12 Any disputes arising out of these Terms of Service will be resolved in English unless otherwise determined by Baze (acting in its sole discretion) or as required by applicable law.

### Changes

22.13 We reserve the right, at our sole discretion, to modify or replace these Terms at any time and by using the Services you are expected to review these Terms on a regular basis. It is therefore important that you review these Terms regularly to ensure you are updated as to any changes.

### Waiver

22.14 The failure of Baze to insist on any occasion upon the performance of the terms, conditions or provisions of this Agreement or time or other indulgence granted by Baze shall not thereby act as a waiver of such breach or acceptance of any variation. The failure of Baze to exercise or enforce any right or provision of the Terms of Service will not constitute a waiver of such right or provision. No waiver by Baze of any default in the performance of any of the provisions of this Agreement shall: (a) operate or be construed as a waiver of any other or further default whether of a like or different character; or (b) be effective unless in writing duly executed by an authorised representative of Baze.

### Privity

22.15 Save for Baze and its affiliates, you or anyone accessing Baze Services pursuant to these Terms of Service, unless otherwise provided in these Terms of Service, no person or entity who is not a party to these Terms of Service will have any right to enforce any term of these Terms of Service, regardless of whether such person or entity has been identified by name, as a member of a class or as answering a particular description. For the avoidance of doubt, this will not affect the rights of any permitted assignee or transferee of these Terms.

### Rights Cumulative

22.16 The rights of Baze herein shall be cumulative and any one or more of the rights, except where specifically excluded, may be exercised at the same time by Baze.

### Binding

22.17 All the terms and provisions of the Terms of Service will be binding upon and inure to the benefit of the parties to the Terms of Service and to their respective heirs, successors, permitted assigns and legal representatives. Baze will be permitted to assign these Terms of Service without notice to you or consent from you. You will have no right to assign or otherwise transfer the Terms of Service, or any of your rights or obligations hereunder, to any third party without Baze’s prior written consent, to be given or withheld in Baze’s sole discretion.

### Notice to Baze

22.18 Wherever provision is made for the giving or issuance of any notice, instruction, consent, approval, or determination, unless otherwise specified, such communication, shall be in writing (this means any handwritten, typewritten or printed communication, including the systems of electronic transmission). All notices shall be delivered by you personally, by electronic communication or by courier to the addresses set forth herein, or to any other addresses as notified by Baze. Such communication shall be delivered by hand delivery/ courier or electronic transmission and shall be deemed to have been received: (a) if sent by hand delivery/courier – at the time of actual delivery and receipt; or (b) if sent by electronic transmission – immediately upon transmission and acknowledgment of same or receipt of a delivery report.

### Contact

22.19 You can contact us by mail at our operational address, by email to [support@trybaze.com](mailto:support@trybaze.com) or through Baze Support.`

  return (
    <BZModal ref={innerRef} title="Terms of Service" snapPoints={['85%']}>
      <Markdown style={styles}>{tos}</Markdown>
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

TOSModal.displayName = 'TOSModal'
export default TOSModal
