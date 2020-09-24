<?php
    if ($_FILES && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $userImage = $_FILES['file']['name'];
        $target = 'user_img/' . $userImage;

        move_uploaded_file($_FILES['file']['tmp_name'], $target);
    }