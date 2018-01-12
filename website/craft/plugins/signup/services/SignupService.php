<?php
namespace Craft;

// Require intercom SDK
require_once(CRAFT_PLUGINS_PATH.'signup/vendor/autoload.php');

// Intercom settings
use Intercom\IntercomClient;

/**
 *
 *
 */
class SignupService extends BaseApplicationComponent
{

  private $token = "";

  public function __construct() {

    // Grab the token from the cookie store
    $token = $_COOKIE['token'];

    // Split this string into user/pass based on the "_" seperator
    $splitPos = strpos($_COOKIE['token'], "_", 3);

    // Extract out user/pass
    $userName = substr($_COOKIE['token'], 0, $splitPos);
    $password = substr(str_replace("_", "", $_COOKIE['token']), $splitPos-1);

    // Store value as class var
    $this->token = $userName.":".$password;

  }

  public function getUser() {

    $url = 'http://api.reconfigure.io/user';
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, $this->token);
    $response = curl_exec($curl);
    $status_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);   //get status code
    curl_close($curl);

    return json_decode($response);

  }

  public function signupUser() {

    $user = $this->getUser();
    $name = $user->value->name;

    if(isset($_POST['email']) && strlen($_POST['email']) > 0) {
      $email = $_POST['email'];
    } else {
      $email = $user->value->email;
    }

    $client = new IntercomClient('dG9rOjc3NDE0ZjkwXzg5ZDVfNGZlYV85YmM2X2QwNTQyNmM2NzM5NjoxOjA=', null);

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        if(!empty($_POST['landing'])){
          $landing = strip_tags(trim($_POST["landing"]));
  				$landing = str_replace(array("\r","\n"),array(" "," "),$landing);
        } else {
          $landing = '';
        }

        // Main goal details
        $main_goal = strip_tags(trim($_POST["main_goal"]));
        $main_goal_intercom = strip_tags(trim($_POST["main_goal"]));

        if (strlen($main_goal_intercom) >= 255) {
          $main_goal_intercom = substr($main_goal_intercom, 0, 252) . '...';
        }

        // Organisation details
        $organisation = strip_tags(trim($_POST["organisation"]));
				$organisation = str_replace(array("\r","\n"),array(" "," "),$organisation);

        $how_many = trim($_POST['how_many']);

        if(!empty($_POST['market_vertical'])){
          $market_vertical = "";
          $market_vertical_intercom = "";
          foreach($_POST['market_vertical'] as $selected){
            $market_vertical .= "$selected\n";
            $market_vertical_intercom .= "$selected, ";
          }
        } else {
          $market_vertical = "N/A\n";
          $market_vertical_intercom = "N/A";
        }

        $market_vertical_other = strip_tags(trim($_POST["market_vertical_other"]));
        $market_vertical_other_intercom = strip_tags(trim($_POST["market_vertical_other"]));

        if (strlen($market_vertical_other_intercom) >= 255) {
          $market_vertical_other_intercom = substr($market_vertical_other_intercom, 0, 252) . '...';
        }

        // Intercom - Create user
        $lead = $client->users->create([
          "email" => $email,
          "name" => $name,
          "companies" => [
            [
              "name" => $organisation,
              "company_id" => uniqid("", true)
            ]
          ],
          "custom_attributes" => [
            'landing' => $landing,
            'main_goal' => $main_goal_intercom,
            'how_many' => $_POST['how_many'],
            'market_vertical' => $market_vertical_intercom,
            'market_vertical_other' => $market_vertical_other_intercom
          ]
        ]);

        // die(var_dump($lead));

        // Discourse
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,"https://community.reconfigure.io/invites?api_key=4bc3e4be003ff01b50845c69e5b298beebda7b9ed29e99e359ccfcdc00312f2f&api_username=reconfigureio");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "email=" . $email . "&group_names=web_leads");

        // receive server response ...
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $server_output = @curl_exec ($ch);

        curl_close ($ch);

        // Check that data was sent to the mailer.
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return array("code" => "400", "text" => "Oops! There was a problem with your submission. Please complete the form and try again.");
            exit;
        }

        // Set the recipient email address.
        $recipient = "hello@reconfigure.io";
        // $recipient = "sean@ayup.agency";

        // Set the email subject.
        $subject = "Contact form submission on Reconfigure.io from $name";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Organisation: $organisation\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "\n";
        $email_content .= "What's your main goal with using Reconfigure.io?\n $main_goal\n\n";
        $email_content .= "\nHow many people work at your organisation?\n $how_many\n\n";
        $email_content .= "\nWhat are your market and technology area(s)?\n $market_vertical\n\n";
        $email_content .= "\nIf other please specify (optional)?\n $market_vertical_other\n\n";
        $email_content .= "\n";

        // Build the email headers.
        $email_headers = "From: $name <$email>\r\n";
        $email_headers .= "Cc: info@ayup.agency\r\n";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
          // Set a 200 (okay) response code.
          return array("code" => "200", "redirect" => true, "url" => "/sign-up/installation");
        } else {
          // Set a 500 (internal server error) response code.
          return array("code" => "500", "text" => "Oops! Something went wrong and we couldn't send your message.");
        }
    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        return array("code" => "403", "text" => "There was a problem with your submission, please try again.");
    }

  }

  public function addBillingInfo() {

    if ($_SERVER["REQUEST_METHOD"] == "POST") {

      // Set card details
      $card_number = strip_tags(trim($_POST["card_number"]));
      $card_name = strip_tags(trim($_POST["card_name"]));
      $card_expiry = strip_tags(trim($_POST["card_expiry"]));
      $card_cvc = strip_tags(trim($_POST["card_cvc"]));

      // Set billing address
      $billing_company = strip_tags(trim($_POST["billing_company"]));
      $billing_address_1 = strip_tags(trim($_POST["billing_address_1"]));
      $billing_address_2 = strip_tags(trim($_POST["billing_address_2"]));
      $billing_city = strip_tags(trim($_POST["billing_city"]));
      $billing_county = strip_tags(trim($_POST["billing_county"]));
      $billing_postcode = strip_tags(trim($_POST["billing_postcode"]));

    }

  }

  public function signupNewsletter() {

    $client = new IntercomClient('dG9rOjc3NDE0ZjkwXzg5ZDVfNGZlYV85YmM2X2QwNTQyNmM2NzM5NjoxOjA=', null);

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

      // Get the form fields and remove whitespace.
      $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

      // Check that data was sent to the mailer.
      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return array("code" => "400", "text" => "Oops! Please enter a valid email address");
      }

      // Intercom
      try {

        $response = $client->leads->create([
          "email" => $email,
          "custom_attributes" => ['newsletter' => "true"],
        ]);

        // Set a 200 (okay) response code.
        return array("code" => "200", "text" => "Thank You! You have been signed up to join our mailing list.");

      } catch(Exception $e) {
        // Not a POST request, set a 403 (forbidden) response code.
        return array("code" => "403", "text" => "There was a problem with your submission, please try again.");
      }

    }

  }

}
