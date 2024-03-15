
Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + (dd[1] ? dd : "0" + dd[0]); // padding
};

$(document).ready(function() 
{
	$('#header').load("layout_v2/header.html");
	$('#main').load("layout_v2/main.html");
	$('#footer').load("layout_v2/footer.html");

	lock_section = `<div class="carousel-item">
                        <div class="card rounded-5">
                            <div class="card-header"></div>
                            <div class="card-body text-center vstack gap-4">
                                <div class="col-8 m-auto">
                                   <img src="assets_v2/img/lock-keyhole.svg" height="100" width="100" alt="lock">
                                </div>
                                <p>locked</p>
                            </div>
                        </div>
                    </div>`; 	

    var _lfcssoidentity = window.localStorage.getItem("lfcssoidentity");
    _lfcssoidentity = JSON.parse(_lfcssoidentity);

    var _lfcssocreds = window.localStorage.getItem("lfcssocreds");
    _lfcssocreds = JSON.parse(_lfcssocreds);

    var username = _lfcssoidentity["cognito:username"];
    var email = _lfcssoidentity.email;
    var idToken = _lfcssocreds.IdToken;

    verify_account();

    function verify_account() {
        var isEmail = false;
        var emailUsername = "";

        if (_lfcssoidentity.identities == undefined) {
            emailUsername = username;
        }
        else {
            emailUsername = email
            isEmail = true;
        }
        var url = _globalContants.lfc_sso_verify_account
        $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Token': idToken
            },
            data: JSON.stringify({
                isEmail: isEmail,
                emailUsername: emailUsername
            }),
            beforeSend: function()
            {
                $("div[id='append_selection']").append(lock_section);
                $("div[id='append_selection']").append(lock_section);
                $("div[id='append_selection']").append(lock_section);
                $("div[id='append_selection']").append(lock_section);           
            },
            success: function(response) 
            {
                $("div[id='append_selection']").html(null);
                
                console.log('isEmail: ' + isEmail)
                console.log('emailUsername: ' + emailUsername)

                var hasHupayRole = false,
                    hasFianaRole = false,
                    hasCahelRole = false;

                if (_lfcssoidentity["cognito:groups"].length > 0) {
                    _lfcssoidentity["cognito:groups"].forEach(function(data) {
                        if (data == "Hupay_Role") 
                        {
                            hasHupayRole = true;
                        }
                        if (data == "Fiana_Role") 
                        {
                            hasFianaRole = true;
                        }
                        if (data == "Cahel_Role") 
                        {
                            hasCahelRole = true;
                        }
                    })
                }

                if (hasHupayRole) 
                {
                    hupay_section = `<div class="carousel-item active" id="hupay_section" type="button">
                                        <div class="card hupay rounded-5">
                                            <div class="card-header"></div>
                                            <div class="card-body text-center vstack gap-4">
                                                <div class="col-8 m-auto">
                                                   <img src="assets_v2/img/hupay.svg" height="100" width="100" alt="hupay">
                                                </div>
                                                <p>8:00am - 8:00pm</p>
                                            </div>
                                        </div>
                                    </div>`;

                    $("div[id='append_selection']").append(hupay_section);  
                }
                else
                {
                    $("div[id='append_selection']").append(lock_section);
                }

                if (hasFianaRole) 
                {
                    fiana_section = `<div class="carousel-item" id="fiana_section" type="button">
                                        <div class="card fiana rounded-5">
                                            <div class="card-header"></div>
                                            <div class="card-body text-center vstack gap-4">
                                                <div class="col-8 m-auto">
                                                   <img src="assets_v2/img/fiana.svg" height="100" width="100" alt="fiana">
                                                </div>
                                                <p>8:00am - 8:00pm</p>
                                            </div>
                                        </div>
                                    </div>`;

                    $("div[id='append_selection']").append(fiana_section);  
                }
                else
                {
                    $("div[id='append_selection']").append(lock_section);
                }

                if (hasCahelRole) 
                {
                    cahel_section = `<div class="carousel-item" id="cahel_section" type="button">
                                        <div class="card cahel rounded-5">
                                            <div class="card-header"></div>
                                            <div class="card-body text-center vstack gap-2">
                                                <div class="col-8 m-auto">
                                                   <img src="assets_v2/img/cahel.svg" height="115" width="120" alt="cahel">
                                                </div>
                                                <p>8:00am - 8:00pm</p>
                                            </div>
                                        </div>
                                    </div>`;

                    $("div[id='append_selection']").append(cahel_section);  
                }
                else
                {
                    $("div[id='append_selection']").append(lock_section);
                }
            },
            error: function(response) 
            {

            }
        })
    } 

	preloader = function()
    {
        setTimeout(function() {
            $("#forPreLoader").fadeOut('slow');
        }, 1000);
    }

    log_out = function() 
    {
        $("div[id='append_selection']").html(null);
        $("div[id='append_selection']").append(lock_section);
        $("div[id='append_selection']").append(lock_section);
        $("div[id='append_selection']").append(lock_section);

        setTimeout(function() {
            $("#forPreLoader").fadeIn('slow');
        }, 500);

        const logout_url = _globalContants.lfc_sso_auth_logout_url + _globalContants.lfc_sso_default_logout_uri;
        window.location.replace(logout_url);
        
        localStorage.clear();
    };

    $(document).on('click', '#hupay_section', function(e) {
        var expires_in = window.localStorage.getItem("expires_in"),
            id_token = window.localStorage.getItem("id_token"),
            access_token = window.localStorage.getItem("access_token"),
            token_type = window.localStorage.getItem("token_type"),
            company_id = 1;

        window.location.href = "http://hupay.lloydsfinancingph.com/hupay/index.php#id_token=" + id_token + "&expires_in=" + expires_in + "&access_token=" + access_token + "&token_type=" + token_type + "&company_id=" + company_id;  
    });

    $(document).on("click", "#fiana_section", function(e) {
        var expires_in = window.localStorage.getItem("expires_in"),
            id_token = window.localStorage.getItem("id_token"),
            access_token = window.localStorage.getItem("access_token"),
            token_type = window.localStorage.getItem("token_type");

        window.location.href = "http://fiana.lloydsfinancingph.com/index.php/verify#id_token=" + id_token + "&expires_in=" + expires_in + "&access_token=" + access_token + "&token_type=" + token_type;
    });

    $(document).on("click", "#cahel_section", function(e) 
    {
        var expires_in = window.localStorage.getItem("expires_in"),
            id_token = window.localStorage.getItem("id_token"),
            access_token = window.localStorage.getItem("access_token"),
            token_type = window.localStorage.getItem("token_type");

        window.location.href = "http://cahel.lloydsfinancingph.com/sso#id_token=" + id_token + "&expires_in=" + expires_in + "&access_token=" + access_token + "&token_type=" + token_type;
    });

    preloader();
});






