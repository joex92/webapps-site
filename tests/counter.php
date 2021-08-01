<?php
    $cookie_name = "JoeXwebApps";
    $cookieset = true;
    if(!isset($_COOKIE[$cookie_name])) {
        setcookie($cookie_name, "viewer", time() + 3600, '/');
        $_COOKIE[$cookie_name] = "viewer";
        $cookieset = false;
    }
?>
<html>
    <head>
        <title>Counter Test</title>
    </head>
    <body>
        <h2>
        <?php
            function getUserIpAddr(){
                if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                    $ip = $_SERVER['HTTP_CLIENT_IP']; 
                } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                    $ip = $_SERVER['HTTP_X_FORWARDED_FOR']; 
                } else {
                    $ip = $_SERVER['REMOTE_ADDR']; 
                } 
                return $ip; 
            }
            function console_log($output, $with_script_tags = true) {
                $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . 
            ');';
                if ($with_script_tags) {
                    $js_code = '<script>' . $js_code . '</script>';
                }
                echo $js_code;
            }
            
            // Connects to your Database
            $con = mysqli_connect($_SERVER["HTTP_MYSQL_HOST"], $_SERVER["HTTP_MYSQL_USER"], $_SERVER["HTTP_MYSQL_PASS"], $_SERVER["HTTP_MYSQL_DB"]);
            
            if (!$con) {
                echo "Error: Unable to connect to MySQL." . PHP_EOL;
                echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
                echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
                exit;
            }
            
            console_log(isset($_COOKIE[$cookie_name]));
        
            if (!$cookieset){
                if ($con->query("UPDATE counter SET `global` = `global` + 1") === TRUE) {
                    console_log("Global counter updated");
                    
                } else {
                    console_log("Global counter not Updated");
                }
            } else {
                console_log("Cookie hasn't expired");
            }
            
            if ($result = $con->query("SELECT global FROM counter")) {
                /* fetch object array */
                while ($row = $result->fetch_row()) {
                    printf ("%s Total View(s)\n", $row[0]);
                }
                /* free result set */
                $result->close();
            }
            
            print("<hr>");
            
            if (count($_COOKIE) > 0) {
                echo "Cookies are enabled.";
            } else {
                echo "Cookies are disabled.";
            }
            
            print("<hr>");
            
            if (!$cookieset) {
                echo "Cookie named '" . $cookie_name . "' is not set!";
            } else {
                echo "Cookie '" . $cookie_name . "' is set!<br>";
                echo "Value is: '" . $_COOKIE[$cookie_name] ."'";
            }
            
            print("<hr>");
            
            $ip = getUserIpAddr();
            $ipinfo = json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
            printf("| ipinfo.io API |<br>IP: %s<br>Hostname: %s<br>Loc: %s<br>Org: %s<br>City: %s<br>Region: %s<br>Country: %s<br>Phone: %s", 
                $ipinfo->ip, $ipinfo->hostname, $ipinfo->loc, $ipinfo->org, $ipinfo->city, $ipinfo->region, $ipinfo->country, $ipinfo->phone);
                
            print("<hr>");
            
            // $ip = "check";
            $ipstack = json_decode(file_get_contents("http://api.ipstack.com/{$ip}?access_key=af2b95ab303f4f5033c14f73b96629cf"));
            if(!$ipstack->success){
                $ipstack->location->country_flag = str_replace("http:","https:",$ipstack->location->country_flag);
                printf("| ipstack.com API |<br>IP: %s<br>Type: %s<br>Continent Code: %s<br>Continent Name: %s<br>Country Code: %s<br>Country Name: %s<br>Region Code: %s<br>Region Name: %s<br>City: %s<br>ZIP Code: %s<br>Latitude: %s<br>Longitude: %s<br>Location:<br>&nbsp;&nbsp;<a href=\"https://www.geonames.org/%s\" target=\"_blank\">Geoname ID</a><br>&nbsp;&nbsp;Capital: %s<br>&nbsp;&nbsp;Languages:<br>&nbsp;&nbsp;&nbsp;&nbsp;Code: %s<br>&nbsp;&nbsp;&nbsp;&nbsp;Name: %s<br>&nbsp;&nbsp;&nbsp;&nbsp;Native: %s<br>&nbsp;&nbsp;<a href=\"%s\" target=\"_blank\">Country Flag</a><br>&nbsp;&nbsp;Country Flag Emoji: %s<br>&nbsp;&nbsp;Country Flag Emoji Unicode: %s<br>&nbsp;&nbsp;Calling Code: %s<br>&nbsp;&nbsp;is EU: %s", 
                    $ipstack->ip, $ipstack->type, $ipstack->continent_code, $ipstack->continent_name, $ipstack->country_code, $ipstack->country_name, $ipstack->region_code, $ipstack->region_name, $ipstack->city, $ipstack->zip, $ipstack->latitude, $ipstack->longitude, $ipstack->location->geoname_id, $ipstack->location->capital, $ipstack->location->languages[0]->code, $ipstack->location->languages[0]->name, $ipstack->location->languages[0]->native, $ipstack->location->country_flag, $ipstack->location->country_flag_emoji, $ipstack->location->country_flag_emoji_unicode, $ipstack->location->calling_code, $ipstack->location->is_eu);
                    
                if ($con->query("SHOW COLUMNS FROM `counter` LIKE '{$ipstack->location->geoname_id}'")->fetch_row()[0] == $ipstack->location->geoname_id){
                    console_log("Geoname ID {$ipstack->location->geoname_id} found");
                } else {
                    console_log("Geoname ID {$ipstack->location->geoname_id} not found");
                    if ($con->query("ALTER TABLE `counter` ADD `{$ipstack->location->geoname_id}` INT(20) NOT NULL ;")){
                        console_log("Geoname ID {$ipstack->location->geoname_id} created");
                    }
                }
                
                if (!$cookieset){
                    if ($con->query("UPDATE counter SET `{$ipstack->location->geoname_id}` = `{$ipstack->location->geoname_id}` + 1") === TRUE) {
                        console_log("{$ipstack->location->geoname_id} counter updated");
                        
                    } else {
                        console_log("{$ipstack->location->geoname_id} counter not updated");
                    }
                } else {
                    console_log("Cookie hasn't expired");
                }
                
                print("<hr>");
                if ($columns = $con->query("SHOW COLUMNS FROM `counter`")->fetch_all()){
                    console_log($columns);
                    foreach ($columns as &$value) {
                        // printf("<br>%s<br>",$value[0]);
                        if ($value[0] != 'global'){
                            $geonameid = $value[0];
                            $geonames = json_decode(file_get_contents("http://api.geonames.org/getJSON?geonameId={$geonameid}&username=joex92&type"));
                            console_log($geonames);
                            if ($result = $con->query("SELECT `{$value[0]}` FROM counter")) {
                                /* fetch object array */
                                while ($row = $result->fetch_row()) {
                                    if (!$geonames->status){
                                        printf ("%s View(s) in <a href=\"https://www.geonames.org/%s\" target=\"_blank\">%s, %s, %s</a><br>", $row[0], $geonameid,$geonames->toponymName,$geonames->adminName1, $geonames->countryCode);
                                    }
                                }
                                /* free result set */
                                $result->close();
                            }
                        }
                    }
                    /* free result set */
                    // $columns->close();
                }
                
                // if ($result = $con->query("SELECT `{$ipstack->location->geoname_id}` FROM counter")) {
                //     /* fetch object array */
                //     while ($row = $result->fetch_row()) {
                //         printf ("<br><br>%s View(s) in %s\n", $row[0], $ipstack->city);
                //     }
                //     /* free result set */
                //     $result->close();
                // }
                
            } else {
                printf("| ipstack.com API |<br>Success: %s<br>&nbsp;&nbsp;Error:<br>&nbsp;&nbsp;&nbsp;&nbsp;Code: %s<br>&nbsp;&nbsp;&nbsp;&nbsp;Type: %s<br>&nbsp;&nbsp;&nbsp;&nbsp;Info: %s",$ipstack->success, $ipstack->error->code, $ipstack->error->type, $ipstack->error->info);
            }
            
            print("<hr>");
            
            mysqli_close($con);
        ?>
        </h2>
    </body>
</html>