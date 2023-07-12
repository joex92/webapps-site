<?
	if ( count($_GET) > 0 ){
		if ( isset($_GET['env']) ){
			$var = $_GET['env'];
			$val = $_ENV[$var];		
			echo json_encode(array('status' => '200', $var => $val));
		} else {
			echo json_encode(array('status' => '404', 'message' => 'Not Found.'));
		}
	} else {
		echo json_encode(array('status' => '400', 'message' => 'Bad Request.'));
	}
?>