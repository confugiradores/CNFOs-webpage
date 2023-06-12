<?php
    // header('Content-Type: application/json; charset=utf-8');
    // header("Access-Control-Allow-Origin: *");
    $mirrors = file_get_contents('http://mirror.confugiradores.es/mirrors.json');
    $mirrors = json_decode($mirrors,true);
    $data = [];
    foreach ($mirrors["servers"] as $mirror) {
        $ip = gethostbyname($mirror["name"]);
        $res = json_decode(file_get_contents("http://ip-api.com/json/$ip"),true);
        $mirror["lat"] = $res["lat"];
        $mirror["lon"] = $res["lon"];
        $mirror["loc"] = $res['city'].",".$res['country'];
        $data[] = $mirror;
    }
    $size=sizeof($data);
    echo "$size OK\n";
    file_put_contents(
        "/var/www/html/cnfos/html/data/mirrors.json",
        json_encode($data)
    );
