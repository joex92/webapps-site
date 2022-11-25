<?
	if (!function_exists('str_contains')) {
		function str_contains($haystack, $needle): bool {
			if ( is_string($haystack) && is_string($needle) ) {
				return '' === $needle || false !== strpos($haystack, $needle);
			} else {
				return false;
			}
		}
	}
	// header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] . "");
	if( isset($_SERVER['HTTP_REFERER']) ) {
	if ( str_contains($_SERVER['HTTP_REFERER'], $_ENV['SERVER_NAME']) ) {
	        // all fine
			echo json_encode($_ENV);
		} else {
			// not allowed
			echo json_encode($_COOKIE);
		}
	} else {
		// not allowed
		echo json_encode($_COOKIE);
	}
?>
