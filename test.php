<html>
	<head>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jshashes/1.0.8/hashes.min.js" integrity="sha512-1HyPmPHvi5wFUctYkBhwOYgXmMdbPrDaXKBrbGRI3o1CQkTKazG/RKqR8QwVIjTDOQ3uAOPOFkEbzi99Td6yiQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
		<script src="node_modules/require.js" crossorigin="anonymous"></script>
		<script>
			// new MD5 instance
			var MD5 = new Hashes.MD5
			// new SHA1 instance
			var SHA1 = new Hashes.SHA1
			// new SHA256 instance
			var SHA256 =  new Hashes.SHA256
			// new SHA512 instace
			var SHA512 = new Hashes.SHA512
			// new RIPEMD-160 instace
			var RMD160 = new Hashes.RMD160
		</script>
	</head>
	<body>
		<?
			echo '<script>phphashalgos = JSON.parse(\'' . json_encode(hash_algos()) . '\'); ';
			echo 'phphashhmacalgos = JSON.parse(\'' . json_encode(hash_hmac_algos()) . '\'); ';
			echo 'phphash = "' . hash_hmac('md5','hashed','secret') . '"; ';
			echo 'jshash = CryptoJS.HmacMD5("hashed","secret");</script>'
		?>
	</body>
</html>