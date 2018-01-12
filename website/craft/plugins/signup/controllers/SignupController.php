<?php
namespace Craft;

class SignupController extends BaseController
{

  protected $allowAnonymous = true;

  public function actionSignupUser() {

    $this->requireAjaxRequest();

    $response = craft()->signup->signupUser();

    http_response_code($response['code']);

    if($response['code'] == "200" || $response['code'] == "301") {
      $this->returnJson($response);
    } else {
      $this->returnErrorJson($response);
    }

  }

  public function actionSignupNewsletter() {

    // $this->requireAjaxRequest();

    $response = craft()->signup->signupNewsletter();

    http_response_code($response['code']);

    if(isset($response['code']) == "200") {
      $this->returnJson($response['text']);
    } else {
      $this->returnErrorJson($response['text']);
    }

  }

}
