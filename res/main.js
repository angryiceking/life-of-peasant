$(document).ready(function(){

    // var world = document.getElementById('world');
    // var world_settings = world.getContext("2d");
    var base_char = "Peasant", base_str = 5, base_agi = 6, base_int = 4, base_hp = 450, base_mana = 250, level = 1;
    var atk_spd = base_agi*0.1 *0.1, bns_armor = base_str * 0.4, bns_mana = base_mana * 0.3, base_dmg = 20;
    var base_mana_threshold = base_mana, base_hp_threshold = base_hp;
    var monster_base_atk = 23;

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
            console.log("You're on current level cap.");
        }
        base_hp = base_hp_threshold;
        base_mana = base_mana_threshold;
        console.log(base_char+" has leveled up!, \nHP: "+base_hp+" \nMana: "+base_mana+"\nSTR: "+base_str
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
        document.getElementById('base_hp').innerHTML = base_hp.toFixed(2);
        document.getElementById('base_mana').innerHTML = base_mana.toFixed(2);
        document.getElementById('base_dmg').innerHTML = base_dmg.toFixed(2);
        document.getElementById('base_str').innerHTML = base_str.toFixed(2);
        document.getElementById('base_agi').innerHTML = base_agi.toFixed(2);
        document.getElementById('base_int').innerHTML = base_int.toFixed(2);
        document.getElementById('atk_spd').innerHTML = atk_spd.toFixed(2);
        document.getElementById('bns_armor').innerHTML = bns_armor.toFixed(2);
        document.getElementById('bns_mana').innerHTML = bns_mana.toFixed(2);
    }

    function basic_atk_random_dmg(base_dmg, atk_spd, base_str) {
        var total_damage = base_dmg * ((atk_spd * 0.05) / (base_str * 0.05)) + base_dmg;
        return total_damage;
    }
    function performCooldown(skill) {

    }
    function deduct_mana(manacost) {
        base_mana -= manacost;
    }

    $(window).keyup(function(e){
        console.log(base_hp_threshold);
        // console.log(e.keyCode);
        e.preventDefault();
        display_stats();
        if (base_hp < 0) {
            console.log('You died miserably..');
        }
        else {
            if (e.keyCode == 78) {
                console.log("Monster dealt: "+monster_base_atk+" damage!");
                base_hp = base_hp - monster_base_atk;
            }
            else if (e.keyCode == 38) {
                level_up();
            }
            else if (e.keyCode == 65) {
                var dmg = basic_atk_random_dmg(base_dmg, atk_spd, base_str);
                console.log("You performed basic attack, dealt "+dmg+" damage.");
            }
            else if (e.keyCode == 90) {
                var s1 = null;
                var dmg = basic_atk_random_dmg(base_dmg*1.55, atk_spd, base_str)
                console.log("You performed skill 1 attack, dealt "+dmg+" damage.");
                deduct_mana(20)
                performCooldown(s1);
            }
            else if (e.keyCode == 88) {
                var s2 = null;
                var dmg = basic_atk_random_dmg(base_dmg*1.85, atk_spd, base_str)
                console.log("You performed skill 2 attack, dealt "+dmg+" damage.");
                deduct_mana(30)
                performCooldown(s2);
            }
            else if (e.keyCode == 67) {
                var s3 = null;
                var dmg = basic_atk_random_dmg(base_dmg*1.95, atk_spd, base_str)
                console.log("You performed skill 3 attack, dealt "+dmg+" damage.");
                deduct_mana(35)
                performCooldown(s3);
            }
            else if (e.keyCode == 86) {
                var s4 = null;
                var dmg = basic_atk_random_dmg(base_dmg*2.05, atk_spd, base_str)
                console.log("You performed skill 4 attack, dealt "+dmg+" damage.");
                deduct_mana(45)
                performCooldown(s4);
            }
            else if (e.keyCode == 66) {
                var s5 = null;
                var dmg = basic_atk_random_dmg(base_dmg*2.25, atk_spd, base_str)
                console.log("You performed skill 5 attack, dealt "+dmg+" damage.");
                deduct_mana(60)
                performCooldown(s5);
            }
        }
    });
    display_stats();
    setInterval(function(){
        display_stats();
    }, 10);
    setInterval(function(){
        mana_regen();
        hp_regen();
    }, 1000);
})
