$(document).ready(function(){

    var world = document.getElementById('viewport').getContext("2d");
    var base_char = {type:"Peasant", speed: 20, x:0, y:0}, base_str = 5, base_agi = 6, base_int = 4, base_hp = 450, base_mana = 250, level = 1;
    var atk_spd = base_agi*0.1 *0.1, bns_armor = base_str * 0.4, bns_mana = base_mana * 0.3, base_dmg = 20;
    var base_mana_threshold = base_mana, base_hp_threshold = base_hp;
    var monster_base_atk = 23;
    var s1_cd = true, s2_cd = true, s3_cd = true, s4_cd = true, s5_cd = true;
    var s1 = true, s2 = false, s3 = false, s4 = false, s5 = false;
    var dead = false, poisoned = false, slowed = false, rooted = false;
    var img = new Image();
    img.src = "avt/img/swrdsman-img.png";
    img.onload = function(){
        world.drawImage(img, 0, 0, 25, 25);
    };

    var keysDown = {};
    addEventListener("keydown", function(e){
        keysDown[e.keyCode] = true;
        e.preventDefault();
    }, false);
    addEventListener("keyup", function(e){
        delete keysDown[e.keyCode];
        e.preventDefault();
    }, false);

    function update(modifier){

        if(38 in keysDown){
            base_char.y -= base_char.speed * modifier;
        }
        if(40 in keysDown){
            base_char.y += base_char.speed * modifier;
        }
        if(37 in keysDown){
            base_char.x -= base_char.speed * modifier;
        }
        if(39 in keysDown){
            base_char.x += base_char.speed * modifier;
        }
    }

    function render(c){
        c.clearRect(0,0,550,550)
        c.drawImage(img,base_char.x,base_char.y,25,25);
    }

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    function display_status(status, dur) {
        $('#status_screen').fadeIn(100);
        document.getElementById('status_screen').innerHTML = status;
        setTimeout(function(){
            $('#status_screen').fadeOut(100);
            document.getElementById('status_screen').innerHTML = '';
        }, dur);
    }

    function level_up() {
        if (level < 60) {
            level += 1;
            if (atk_spd >= 120) {
                base_dmg += 4;
                base_str += 4;
                base_agi += 4;
                base_int += 4;
                base_hp_threshold += base_str * 0.4;
                base_mana_threshold += base_int * 0.3;
                bns_armor += base_str * 0.09;
                bns_mana += base_int * 0.07;
            }
            else {
                if (level >= 25) {
                    if (level == 36) {
                        s4 = true;
                        display_status("You learned a new skill: <strong>MAGIC BIND</strong>", 2500);
                        $('#v').fadeIn();
                        $('#vcd').fadeIn(100);
                    }
                    if (level == 48) {
                        s5 = true;
                        display_status("You learned a new skill: <strong>IMPACT</strong>", 2500);
                        $('#b').fadeIn();
                        $('#bcd').fadeIn(100);
                    }
                    base_dmg += 4;
                    base_str += 4;
                    base_agi += 4;
                    base_int += 4;
                    base_hp_threshold += base_str * 0.4;
                    base_mana_threshold += base_int * 0.3;
                    atk_spd += (base_agi*0.1) * 0.2;
                    bns_armor += base_str * 0.09;
                    bns_mana += base_int * 0.07;
                }
                else {
                    if (level == 15) {
                        s2 =  true;
                        $('#xcd').fadeIn(100);
                        display_status("You learned a new skill: <strong>SLASH</strong>", 2500);
                        $('#x').fadeIn();
                    }
                    if (level == 24) {
                        s3 = true;
                        $('#ccd').fadeIn(100);
                        display_status("You learned a new skill: <strong>COLD SLASH</strong>", 2500);
                        $('#c').fadeIn();
                    }
                    base_dmg += 2;
                    base_str += 2;
                    base_agi += 2;
                    base_int += 2;
                    base_hp_threshold += base_str * 0.2;
                    base_mana_threshold += base_int * 0.1;
                    atk_spd += (base_agi*0.1) * 0.2;
                    bns_armor += base_str * 0.02;
                    bns_mana += base_int * 0.02;
                }
            }
        }
        else {
            display_status("You're on current level cap.", 3000);
        }
        base_hp = base_hp_threshold;
        base_mana = base_mana_threshold;
        console.log(base_char["type"]+" has leveled up!, \nHP: "+base_hp+" \nMana: "+base_mana+"\nSTR: "+base_str
            +"\nAGI: "+base_agi+"\nINT: "+base_int+"\nATK_SPD: "+atk_spd+"\nDEF: "+bns_armor+"\nMAGIC AMP: "+bns_mana);
    }
    function mana_regen() {
        if (base_mana_threshold > base_mana) {
            base_mana += base_int*0.05;
        }
        else {

        }
    }
    function hp_regen() {
        if (base_hp_threshold > base_hp) {
            base_hp += base_str*0.05;
        }
        else {

        }
    }
    function display_stats() {
        document.getElementById('level').innerHTML = level;
        document.getElementById('base_hp').innerHTML = base_hp.toFixed(0);
        document.getElementById('base_mana').innerHTML = base_mana.toFixed(0);
        document.getElementById('base_dmg').innerHTML = base_dmg.toFixed(0);
        document.getElementById('base_str').innerHTML = base_str.toFixed(0);
        document.getElementById('base_agi').innerHTML = base_agi.toFixed(0);
        document.getElementById('base_int').innerHTML = base_int.toFixed(0);
        document.getElementById('atk_spd').innerHTML = atk_spd.toFixed(2);
        document.getElementById('bns_armor').innerHTML = bns_armor.toFixed(0);
        document.getElementById('bns_mana').innerHTML = bns_mana.toFixed(0);
    }

    function basic_atk_random_dmg(base_dmg, atk_spd, base_str) {
        var total_damage = base_dmg * ((atk_spd * 0.05) / (base_str * 0.05)) + base_dmg;
        return total_damage;
    }
    function performCooldown(skill, duration) {
        console.log(skill);
        setTimeout(function(){
            skill = true;
        }, duration)
    }
    function deduct_mana(manacost) {
        base_mana -= manacost;
    }

    $(window).keyup(function(e){
        e.preventDefault();
        display_stats();
        if (base_hp < 0) {
            base_hp = 0;
            display_status('You died miserably..', 2500);
        }
        else {
            if (e.keyCode == 78) {
                display_status("Monster dealt: "+monster_base_atk+" damage!", 3000);
                base_hp = base_hp - monster_base_atk;
            }
            else if (e.keyCode == 47) {
                level_up();
            }
            else if (e.keyCode == 65) {
                var dmg = basic_atk_random_dmg(base_dmg, atk_spd, base_str);
                display_status("You performed basic attack, dealt "+dmg.toFixed(2)+" damage.", 3000);
            }
            else if (e.keyCode == 90) {
                if (base_mana-20 > 0) {
                    var cd_counter = 6;
                    if (s1_cd == true) {
                        var s1 = null;
                        s1_cd = false;
                        var dmg = basic_atk_random_dmg(base_dmg*1.55, atk_spd, base_str)
                        display_status("You performed skill 1 attack, dealt "+dmg.toFixed(2)+" damage.", 3000);
                        deduct_mana(20)
                        $('#z').css("opacity", 0.10);
                        var counter = 0.10;
                        setInterval(function(){
                            $('#z').css("opacity", counter += 0.05);
                        },200);
                        var stop = setInterval(function(){
                            if (cd_counter == 1) {
                                document.getElementById('zcd').innerHTML = '';
                                document.getElementById('zcd').innerHTML = 6;
                            }
                            else {
                                document.getElementById('zcd').innerHTML = '';
                                document.getElementById('zcd').innerHTML = cd_counter -= 1;
                            }
                        }, 1000);
                        setTimeout(function(){
                            s1_cd = true;
                        }, 6000);
                        setTimeout(function(){
                            clearInterval(stop);
                        }, 7000);
                    }
                    else {
                        display_status("Skill on cooldown!", 3000);
                    }
                }
                else {
                    display_status("You don't have enough mana.", 3000);
                }
            }
            else if (e.keyCode == 88) {
                if (level < 15) {
                    console.log(level >= 15);
                    display_status("You don't know that skill yet.", 3000);
                }
                else {
                    // console.log(level >= 15);
                    if (base_mana-30 > 0) {
                        var cd_counter_2 = 8;
                        if (s2_cd == true) {
                            var s2 = null;
                            var dmg = basic_atk_random_dmg(base_dmg*1.85, atk_spd, base_str)
                            display_status("You performed skill 2 attack, dealt "+dmg.toFixed(2)+" damage.", 3000);
                            deduct_mana(30)
                            s2_cd = false;
                            $('#x').css("opacity", 0.05);
                            var counter2 = 0.05;
                            setInterval(function(){
                                $('#x').css("opacity", counter2 += 0.05);
                            },200);
                            var stop = setInterval(function(){
                                if (cd_counter_2 == 1) {
                                    document.getElementById('xcd').innerHTML = '';
                                    document.getElementById('xcd').innerHTML = 8;
                                }
                                else {
                                    document.getElementById('xcd').innerHTML = '';
                                    document.getElementById('xcd').innerHTML = cd_counter_2 -= 1;
                                }
                            }, 1000);
                            setTimeout(function(){
                                s2_cd = true;
                            }, 8000)
                            setTimeout(function(){
                                clearInterval(stop);
                            }, 9000);
                        }
                        else {
                            display_status("Skill on cooldown!", 3000);
                        }
                    }
                    else {
                        display_status("You don't have enough mana.", 3000);
                    }
                }
            }
            else if (e.keyCode == 67) {
                if (level < 24) {
                    display_status("You don't know thact skill yet.", 3000);
                }
                else {
                    if (base_mana-35 > 0) {
                        $('#ccd').fadeIn(100);
                        var cd_counter_3 = 10;
                        if (s3_cd == true) {
                            var s3 = null;
                            var dmg = basic_atk_random_dmg(base_dmg*1.95, atk_spd, base_str)
                            display_status("You performed skill 3 attack, dealt "+dmg.toFixed(2)+" damage.", 3000);
                            deduct_mana(35);
                            s3_cd = false;
                            $('#c').css("opacity", 0.05);
                            var counter3 = 0.04;
                            setInterval(function(){
                                $('#c').css("opacity", counter3 += 0.04);
                            },200);
                            var stop = setInterval(function(){
                                if (cd_counter_3 == 1) {
                                    document.getElementById('ccd').innerHTML = '';
                                    document.getElementById('ccd').innerHTML = 10;
                                }
                                else {
                                    document.getElementById('ccd').innerHTML = '';
                                    document.getElementById('ccd').innerHTML = cd_counter_3 -= 1;
                                }
                            }, 1000);
                            setTimeout(function(){
                                s3_cd = true;
                            }, 10000)
                            setTimeout(function(){
                                clearInterval(stop);
                            }, 11000);
                        }
                        else {
                            display_status("Skill on cooldown!", 3000);
                        }
                    }
                    else {
                        display_status("You don't have enough mana.", 3000);
                    }
                }
            }
            else if (e.keyCode == 86) {
                if (level < 36) {
                    display_status("You don't know twwhat skill yet.", 3000);
                }
                else {
                    if (base_mana-45 > 0) {
                        var cd_counter_4 = 12;
                        $('#vcd').fadeIn(100);
                        if (s4_cd == true) {
                            var s4 = null;
                            var dmg = basic_atk_random_dmg(base_dmg*2.05, atk_spd, base_str)
                            display_status("You performed skill 4 attack, dealt "+dmg.toFixed(2)+" damage.", 3000);
                            deduct_mana(45)
                            s4_cd = false;
                            $('#v').css("opacity", 0.05);
                            var counter4 = 0.03;
                            setInterval(function(){
                                $('#v').css("opacity", counter4 += 0.03);
                            },200);
                            var stop = setInterval(function(){
                                if (cd_counter_4 == 1) {
                                    document.getElementById('vcd').innerHTML = '';
                                    document.getElementById('vcd').innerHTML = 12;
                                }
                                else {
                                    document.getElementById('vcd').innerHTML = '';
                                    document.getElementById('vcd').innerHTML = cd_counter_4 -= 1;
                                }
                            }, 1000);
                            setTimeout(function(){
                                s4_cd = true;
                            }, 12000);
                            setTimeout(function(){
                                clearInterval(stop);
                            }, 13000);
                        }
                        else {
                            display_status("Skill on cooldown!", 3000);
                        }
                    }
                    else {
                        display_status("You don't have enough mana", 3000);
                    }
                }
            }
            else if (e.keyCode == 66) {
                if (level < 48) {
                    display_status("You don't know thaaat skill yet.", 3000);
                }
                else {
                    $('#bcd').fadeIn(100);
                    if (base_mana-60 > 0) {
                        var cd_counter_5 = 15;
                        if (s5_cd == true) {
                            var s5 = null;
                            var dmg = basic_atk_random_dmg(base_dmg*2.25, atk_spd, base_str)
                            display_status("You performed skill 5 attack, dealt "+dmg.toFixed(2)+" damage.", 3000);
                            deduct_mana(60)
                            s5_cd = false;
                            $('#b').css("opacity", 0.05);
                            var counter2 = 0.01;
                            setInterval(function(){
                                $('#b').css("opacity", counter2 += 0.02);
                            },200);
                            var stop = setInterval(function(){
                                if (cd_counter_5 == 1) {
                                    document.getElementById('bcd').innerHTML = '';
                                    document.getElementById('bcd').innerHTML = 15;
                                }
                                else {
                                    document.getElementById('bcd').innerHTML = '';
                                    document.getElementById('bcd').innerHTML = cd_counter_5 -= 1;
                                }
                            }, 1000);
                            setTimeout(function(){
                                s5_cd = true;
                            }, 15000)
                            setTimeout(function(){
                                clearInterval(stop);
                            }, 16000);
                        }
                        else {
                            display_status("Skill on cooldown!", 3000);
                        }
                    }
                    else {
                        display_status("You don't have enough mana.", 3000);
                    }
                }
            }
        }
    });
display_stats();

function loop(){
    mana_regen();
    hp_regen();  
}
var looper = setInterval(loop, 1000);
setInterval(function(){
    update(12/1000);
    render(world);
    display_stats();
    if (dead = true) {
        clearInterval(looper);
    }
}, 10);
});