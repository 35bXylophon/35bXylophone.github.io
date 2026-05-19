// ----------------------------------------------
// Stand 28.12.2020 version 1 (veröffentlicht)
// script für QuickCheck Fragebogen
// statische App

// ### INITIALIZATION 
// ----------------------------------------------
// ### VARIABLES
//-----------------------------------------------
// User variables

// Function to download data to a file
function download(data, filename, type) {
    var output = "**** Download Quickcheck ****** " + new Date() + "\n\r";

    function getFieldsetLabel(groupName) {
        var fieldset = document.querySelector('fieldset[name="' + groupName + '"]');
        if (!fieldset) return groupName;
        var legend = fieldset.querySelector("legend");
        var question = fieldset.querySelector("p");
        var label = legend ? legend.innerText.trim() : groupName;
        var detail = question ? question.innerText.trim() : "";
        return detail ? label + " - " + detail : label;
    }

    function getRadioAnswerText(groupName) {
        var selected = document.querySelector('input[name="' + groupName + '"]:checked');
        if (!selected) return "keine Angabe";
        var label = selected.nextElementSibling;
        if (label && label.tagName.toLowerCase() === "label") return label.innerText.trim();
        return selected.value || "ausgewählt";
    }

    var radioGroups = [
        "Q0_1","Q0_2","Q0_3",
        "A1","A2","A3","A4","A5","A6",
        "B1","B2","B3","B4","B5",
        "C1","C2","C3","C4","C5","C6","C7",
        "D1","D2","D3","D4",
        "E1","E2","E3",
        "F1","F2","F3"
    ];

    radioGroups.forEach(function(group) {
        output += getFieldsetLabel(group) + ": " + getRadioAnswerText(group) + "\n\r";
    });

    var checkboxGroup = "Q0_4[]";
    var checkboxes = document.querySelectorAll('input[name="' + checkboxGroup + '"]');
    if (checkboxes.length) {
        var values = [];
        checkboxes.forEach(function(chk) {
            if (chk.checked) values.push(chk.value);
        });
        var other = document.getElementById("Q0_4_other");
        if (other && other.value.trim()) values.push("Sonstiges: " + other.value.trim());
        output += "Frage 0.4 - Hauptauslöser für Digitalisierungsprojekte: " +
            (values.length ? values.join(", ") : "keine Angabe") + "\n\r";
    }

    document.querySelectorAll('textarea').forEach(function(area) {
        if (area.value.trim()) {
            output += area.id + ": " + area.value.trim() + "\n\r";
        }
    });

    output += "****** Empfehlung QUICKCHEK ******" + "\n\r";

    for (var i = 0; i < 18; i++) {
        var rang = document.getElementById("Rang" + i);
        var schnitt = document.getElementById("Schnitt" + i);
        var wert = document.getElementById("Wert" + i);
        var rat = document.getElementById("Rat" + i);
        output += "\n\r" +
            (rang ? rang.value : "") + "\t" +
            (schnitt ? schnitt.value : "") + "\t" +
            (wert ? wert.value : "") + "\t" +
            (rat ? rat.value : "");
    }

    filename = filename || "Quick_Check.txt";
    if (!(/\.[a-zA-Z0-9]+$/.test(filename))) {
        filename += ".txt";
    }
    type = type && type.indexOf("text") >= 0 ? type : "text/plain;charset=utf-8";

    var file = new Blob([output], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
//********************************************* */

var radioGroups = [
    "Q0_1","Q0_2","Q0_3",
    "A1","A2","A3","A4","A5","A6",
    "B1","B2","B3","B4","B5",
    "C1","C2","C3","C4","C5","C6","C7",
    "D1","D2","D3","D4",
    "E1","E2","E3",
    "F1","F2","F3"
];
var checkboxGroups = ["Q0_4[]"];
var kriterien = [
    "Augmented Reality","Virtual Reality","Bewertungsportale","Blogs", "Chatbots","Digitale Bezahlsysteme",
    "Emails","externer E-Marketplace","Foren","Instant Messenger","Mobile Apps","Newsletter (Email)","Eigener Online-Shop",
    "Social Media","Sprachassistenten","Track and Trace (Sendungsverfolgung)","Videokonferenzen","Webseite"
];
// ----------------------------------------------
// ### FUNCTIONS 
// ----------------------------------------------
function weiter(){
    console.log("funktion weiter aufgerufen")
}

function function_back_to_question(){
    console.log("back to question")
    window.scrollTo(0,760);
}

function initialize_page() { 
	// Initialize buttons
	// button1: Fragebogen zurücksetzten -> mode="default"
	// button2: Fragebogen auswerten -> mode="check" -> mode="asses"
	//document.getElementById('check').innerText="starten"
	//document.getElementById('F1A').checked=true

	document.getElementById("check").value="Es sind 33 Fragen zu beantworten"
	document.getElementById("check1").value="Es sind 33 Fragen zu beantworten"
	document.getElementById("A1A").checked=false
	document.getElementById("A1B").checked=false
	document.getElementById("A1C").checked=false
	document.getElementById("A1D").checked=false
	document.getElementById("A2A").checked=false
	document.getElementById("A2B").checked=false
	document.getElementById("A2C").checked=false
	document.getElementById("A2D").checked=false
	document.getElementById("A3A").checked=false
	document.getElementById("A3B").checked=false
	document.getElementById("A3C").checked=false
	document.getElementById("A3D").checked=false
	document.getElementById("A4A").checked=false
	document.getElementById("A4B").checked=false
	document.getElementById("A4C").checked=false
	document.getElementById("A4D").checked=false
	document.getElementById("A5A").checked=false
	document.getElementById("A5B").checked=false
	document.getElementById("A5C").checked=false
	document.getElementById("A5D").checked=false
	document.getElementById("A6A").checked=false
	document.getElementById("A6B").checked=false
	document.getElementById("A6C").checked=false
	document.getElementById("A6D").checked=false
	document.getElementById("B1A").checked=false
	document.getElementById("B1B").checked=false
	document.getElementById("B1C").checked=false
	document.getElementById("B1D").checked=false
	document.getElementById("B2A").checked=false
	document.getElementById("B2B").checked=false
	document.getElementById("B2C").checked=false
	document.getElementById("B2D").checked=false
	document.getElementById("B3A").checked=false
	document.getElementById("B3B").checked=false
	document.getElementById("B3C").checked=false
	document.getElementById("B3D").checked=false
	document.getElementById("B4A").checked=false
	document.getElementById("B4B").checked=false
	document.getElementById("B4C").checked=false
	document.getElementById("B4D").checked=false
	document.getElementById("B5A").checked=false
	document.getElementById("B5B").checked=false
	document.getElementById("B5C").checked=false
	document.getElementById("B5D").checked=false
	document.getElementById("C1A").checked=false
	document.getElementById("C1B").checked=false
	document.getElementById("C1C").checked=false
	document.getElementById("C1D").checked=false
	document.getElementById("C2A").checked=false
	document.getElementById("C2B").checked=false
	document.getElementById("C2C").checked=false
	document.getElementById("C2D").checked=false
	document.getElementById("C3A").checked=false
	document.getElementById("C3B").checked=false
	document.getElementById("C3C").checked=false
	document.getElementById("C3D").checked=false
	document.getElementById("C4A").checked=false
	document.getElementById("C4B").checked=false
	document.getElementById("C4C").checked=false
	document.getElementById("C4D").checked=false
    document.getElementById("C5A").checked=false
    document.getElementById("C5B").checked=false
    document.getElementById("C5C").checked=false
    document.getElementById("C5D").checked=false
    document.getElementById("C6A").checked=false
    document.getElementById("C6B").checked=false
    document.getElementById("C6C").checked=false
    document.getElementById("C6D").checked=false
    document.getElementById("C7A").checked=false
    document.getElementById("C7B").checked=false
    document.getElementById("C7C").checked=false
    document.getElementById("C7D").checked=false
    document.getElementById("D1A").checked=false
    document.getElementById("D1B").checked=false
    document.getElementById("D1C").checked=false
    document.getElementById("D1D").checked=false
    document.getElementById("D2A").checked=false
    document.getElementById("D2B").checked=false
    document.getElementById("D2C").checked=false
    document.getElementById("D2D").checked=false
    document.getElementById("D3A").checked=false
    document.getElementById("D3B").checked=false
    document.getElementById("D3C").checked=false
    document.getElementById("D3D").checked=false
    document.getElementById("D4A").checked=false
    document.getElementById("D4B").checked=false
    document.getElementById("D4C").checked=false
    document.getElementById("D4D").checked=false
    document.getElementById("E1A").checked=false
    document.getElementById("E1B").checked=false
    document.getElementById("E1C").checked=false
    document.getElementById("E1D").checked=false
    document.getElementById("E2A").checked=false
    document.getElementById("E2B").checked=false
    document.getElementById("E2C").checked=false
    document.getElementById("E2D").checked=false
    document.getElementById("E3A").checked=false
    document.getElementById("E3B").checked=false
    document.getElementById("E3C").checked=false
    document.getElementById("E3D").checked=false
    document.getElementById("F1A").checked=false
    document.getElementById("F1B").checked=false
    document.getElementById("F1C").checked=false
    document.getElementById("F1D").checked=false
    document.getElementById("F2A").checked=false
    document.getElementById("F2B").checked=false
    document.getElementById("F2C").checked=false
    document.getElementById("F2D").checked=false
    document.getElementById("F3A").checked=false
    document.getElementById("F3B").checked=false
    document.getElementById("F3C").checked=false
    document.getElementById("F3D").checked=false

	
	for (i=0;i<18;i++){
        feld="Rang"+i
        document.getElementById("feld").style.backgroundColor="floralwhite"
        feld="Rat"+i
        document.getElementById("feld").style.backgroundColor="floralwhite"
        feld="Schnitt"+i
        document.getElementById("feld").style.backgroundColor="floralwhite"
        feld="Wert"+i
        document.getElementById("feld").style.backgroundColor="floralwhite"
    }
}

// Initialize buttons
//$('#button2').html("  Next Question  ")
// $('#button2').on("click", function() {
function function_button2() {
    window.scrollTo(0,780)
	document.getElementById("check").value="alle Antworten zurückgesetzt"
	document.getElementById("check1").value="alle Antworten zurückgesetzt"
    document.getElementById("Q0_1A").checked=false
    document.getElementById("Q0_1B").checked=false
    document.getElementById("Q0_1C").checked=false
    document.getElementById("Q0_1D").checked=false
	document.getElementById("Q0_2A").checked=false
	document.getElementById("Q0_2B").checked=false
    document.getElementById("Q0_2C").checked=false
    document.getElementById("Q0_2D").checked=false
    document.getElementById("Q0_3A").checked=false
    document.getElementById("Q0_3B").checked=false
    document.getElementById("Q0_3C").checked=false
    document.getElementById("Q0_3D").checked=false
    document.getElementById("Q0_4_1").checked=false
    document.getElementById("Q0_4_2").checked=false
    document.getElementById("Q0_4_3").checked=false
    document.getElementById("Q0_4_4").checked=false
    document.getElementById("Q0_4_5").checked=false
    document.getElementById("Q0_4_6").checked=false
    document.getElementById("Q0_4_7").checked=false
    document.getElementById("Q0_4_8").checked=false
    document.getElementById("A1A").checked=false
    document.getElementById("A1B").checked=false
	document.getElementById("A1C").checked=false
	document.getElementById("A1D").checked=false
	document.getElementById("A2A").checked=false
	document.getElementById("A2B").checked=false
	document.getElementById("A2C").checked=false
	document.getElementById("A2D").checked=false
	document.getElementById("A3A").checked=false
	document.getElementById("A3B").checked=false
	document.getElementById("A3C").checked=false
	document.getElementById("A3D").checked=false
	document.getElementById("A4A").checked=false
	document.getElementById("A4B").checked=false
	document.getElementById("A4C").checked=false
	document.getElementById("A4D").checked=false
	document.getElementById("A5A").checked=false
	document.getElementById("A5B").checked=false
	document.getElementById("A5C").checked=false
	document.getElementById("A5D").checked=false
	document.getElementById("A6A").checked=false
	document.getElementById("A6B").checked=false
	document.getElementById("A6C").checked=false
	document.getElementById("A6D").checked=false
	document.getElementById("B1A").checked=false
	document.getElementById("B1B").checked=false
	document.getElementById("B1C").checked=false
	document.getElementById("B1D").checked=false
	document.getElementById("B2A").checked=false
	document.getElementById("B2B").checked=false
	document.getElementById("B2C").checked=false
	document.getElementById("B2D").checked=false
	document.getElementById("B3A").checked=false
	document.getElementById("B3B").checked=false
	document.getElementById("B3C").checked=false
	document.getElementById("B3D").checked=false
	document.getElementById("B4A").checked=false
	document.getElementById("B4B").checked=false
	document.getElementById("B4C").checked=false
	document.getElementById("B4D").checked=false
	document.getElementById("B5A").checked=false
	document.getElementById("B5B").checked=false
	document.getElementById("B5C").checked=false
	document.getElementById("B5D").checked=false
	document.getElementById("C1A").checked=false
	document.getElementById("C1B").checked=false
	document.getElementById("C1C").checked=false
	document.getElementById("C1D").checked=false
	document.getElementById("C2A").checked=false
	document.getElementById("C2B").checked=false
	document.getElementById("C2C").checked=false
	document.getElementById("C2D").checked=false
	document.getElementById("C3A").checked=false
	document.getElementById("C3B").checked=false
	document.getElementById("C3C").checked=false
	document.getElementById("C3D").checked=false
	document.getElementById("C4A").checked=false
	document.getElementById("C4B").checked=false
	document.getElementById("C4C").checked=false
	document.getElementById("C4D").checked=false
    document.getElementById("C5A").checked=false
    document.getElementById("C5B").checked=false
    document.getElementById("C5C").checked=false
    document.getElementById("C5D").checked=false
    document.getElementById("C6A").checked=false
    document.getElementById("C6B").checked=false
    document.getElementById("C6C").checked=false
    document.getElementById("C6D").checked=false
    document.getElementById("C7A").checked=false
    document.getElementById("C7B").checked=false
    document.getElementById("C7C").checked=false
    document.getElementById("C7D").checked=false
    document.getElementById("D1A").checked=false
    document.getElementById("D1B").checked=false
    document.getElementById("D1C").checked=false
    document.getElementById("D1D").checked=false
    document.getElementById("D2A").checked=false
    document.getElementById("D2B").checked=false
    document.getElementById("D2C").checked=false
    document.getElementById("D2D").checked=false
    document.getElementById("D3A").checked=false
    document.getElementById("D3B").checked=false
    document.getElementById("D3C").checked=false
    document.getElementById("D3D").checked=false
    document.getElementById("D4A").checked=false
    document.getElementById("D4B").checked=false
    document.getElementById("D4C").checked=false
    document.getElementById("D4D").checked=false
    document.getElementById("E1A").checked=false
    document.getElementById("E1B").checked=false
    document.getElementById("E1C").checked=false
    document.getElementById("E1D").checked=false
    document.getElementById("E2A").checked=false
    document.getElementById("E2B").checked=false
    document.getElementById("E2C").checked=false
    document.getElementById("E2D").checked=false
    document.getElementById("E3A").checked=false
    document.getElementById("E3B").checked=false
    document.getElementById("E3C").checked=false
    document.getElementById("E3D").checked=false
    document.getElementById("F1A").checked=false
    document.getElementById("F1B").checked=false
    document.getElementById("F1C").checked=false
    document.getElementById("F1D").checked=false
    document.getElementById("F2A").checked=false
    document.getElementById("F2B").checked=false
    document.getElementById("F2C").checked=false
    document.getElementById("F2D").checked=false
    document.getElementById("F3A").checked=false
    document.getElementById("F3B").checked=false
    document.getElementById("F3C").checked=false
    document.getElementById("F3D").checked=false
    // set default color
    document.getElementById("Q1").style.backgroundColor="floralwhite"
    document.getElementById("Q2").style.backgroundColor="floralwhite"
    document.getElementById("Q3").style.backgroundColor="floralwhite"
    document.getElementById("Q4").style.backgroundColor="floralwhite"
    document.getElementById("Q5").style.backgroundColor="floralwhite"
    document.getElementById("Q6").style.backgroundColor="floralwhite"
    document.getElementById("Q7").style.backgroundColor="floralwhite"
    document.getElementById("Q8").style.backgroundColor="floralwhite"
    document.getElementById("Q9").style.backgroundColor="floralwhite"
    document.getElementById("Q10").style.backgroundColor="floralwhite"
    document.getElementById("Q11").style.backgroundColor="floralwhite"
    document.getElementById("Q12").style.backgroundColor="floralwhite"
    document.getElementById("Q13").style.backgroundColor="floralwhite"
    document.getElementById("Q14").style.backgroundColor="floralwhite"
    document.getElementById("Q15").style.backgroundColor="floralwhite"
    document.getElementById("Q16").style.backgroundColor="floralwhite"
    document.getElementById("Q17").style.backgroundColor="floralwhite"
    document.getElementById("Q18").style.backgroundColor="floralwhite"
    document.getElementById("Q19").style.backgroundColor="floralwhite"
    document.getElementById("Q20").style.backgroundColor="floralwhite"
    document.getElementById("Q21").style.backgroundColor="floralwhite"
    document.getElementById("Q22").style.backgroundColor="floralwhite"
    document.getElementById("Q23").style.backgroundColor="floralwhite"
    document.getElementById("Q24").style.backgroundColor="floralwhite"
    document.getElementById("Q25").style.backgroundColor="floralwhite"
    document.getElementById("Q26").style.backgroundColor="floralwhite"
    document.getElementById("Q27").style.backgroundColor="floralwhite"
    document.getElementById("Q28").style.backgroundColor="floralwhite"
    document.getElementById("Q29").style.backgroundColor="floralwhite"
    document.getElementById("Q30").style.backgroundColor="floralwhite"
    document.getElementById("Q31").style.backgroundColor="floralwhite"
    document.getElementById("Q32").style.backgroundColor="floralwhite"
    document.getElementById("Q33").style.backgroundColor="floralwhite"
    document.getElementById("Q0_1").style.backgroundColor="floralwhite"
    document.getElementById("Q0_2").style.backgroundColor="floralwhite"
    document.getElementById("Q0_3").style.backgroundColor="floralwhite"
    document.getElementById("Q0_4").style.backgroundColor="floralwhite"
    
    for (i=0;i<18;i++){
        feld="Rang"+i
        document.getElementById(feld).style.backgroundColor="floralwhite"
        feld="Rat"+i
        document.getElementById(feld).style.backgroundColor="floralwhite"
        feld="Schnitt"+i
        document.getElementById(feld).style.backgroundColor="floralwhite"
        feld="Wert"+i
        document.getElementById(feld).style.backgroundColor="floralwhite"
    }
}    

// gotostart  buttons
//$('#button0').html("  scroll down to quickcheck questionaire  ")
function function_button0() {
	window.scrollBy({ top: 750, left: 0, behavior: "smooth" })	
}

// Initialize buttons
//$('#button1').html("  Next Question  ")
//$('#button1').on("click", function() {
function count() {

    j=0
	document.getElementById('check').value="Bitte die 33 Fragen beantworten"
	document.getElementById('check1').value="Bitte die 33 Fragen beantworten"
	for (var i = 1; i <= 33; i++){
			antwort[i]=1
    }
    // set default color
    document.getElementById("Q0_1").style.backgroundColor="floralwhite"
    document.getElementById("Q0_2").style.backgroundColor="floralwhite"
    document.getElementById("Q0_3").style.backgroundColor="floralwhite"
    document.getElementById("Q0_4").style.backgroundColor="floralwhite"
    document.getElementById("Q1").style.backgroundColor="floralwhite"
    document.getElementById("Q2").style.backgroundColor="floralwhite"
    document.getElementById("Q3").style.backgroundColor="floralwhite"
    document.getElementById("Q4").style.backgroundColor="floralwhite"
    document.getElementById("Q5").style.backgroundColor="floralwhite"
    document.getElementById("Q6").style.backgroundColor="floralwhite"
    document.getElementById("Q7").style.backgroundColor="floralwhite"
    document.getElementById("Q8").style.backgroundColor="floralwhite"
    document.getElementById("Q9").style.backgroundColor="floralwhite"
    document.getElementById("Q10").style.backgroundColor="floralwhite"
    document.getElementById("Q11").style.backgroundColor="floralwhite"
    document.getElementById("Q12").style.backgroundColor="floralwhite"
    document.getElementById("Q13").style.backgroundColor="floralwhite"
    document.getElementById("Q14").style.backgroundColor="floralwhite"
    document.getElementById("Q15").style.backgroundColor="floralwhite"
    document.getElementById("Q16").style.backgroundColor="floralwhite"
    document.getElementById("Q17").style.backgroundColor="floralwhite"
    document.getElementById("Q18").style.backgroundColor="floralwhite"
    document.getElementById("Q19").style.backgroundColor="floralwhite"
    document.getElementById("Q20").style.backgroundColor="floralwhite"
    document.getElementById("Q21").style.backgroundColor="floralwhite"
    document.getElementById("Q22").style.backgroundColor="floralwhite"
    document.getElementById("Q23").style.backgroundColor="floralwhite"
    document.getElementById("Q24").style.backgroundColor="floralwhite"
    document.getElementById("Q25").style.backgroundColor="floralwhite"
    document.getElementById("Q26").style.backgroundColor="floralwhite"
    document.getElementById("Q27").style.backgroundColor="floralwhite"
    document.getElementById("Q28").style.backgroundColor="floralwhite"
    document.getElementById("Q29").style.backgroundColor="floralwhite"
    document.getElementById("Q30").style.backgroundColor="floralwhite"
    document.getElementById("Q31").style.backgroundColor="floralwhite"
    document.getElementById("Q32").style.backgroundColor="floralwhite"
    document.getElementById("Q33").style.backgroundColor="floralwhite"



    // test ob alle Fragen beantwortet muss getriggert werden durch neue Eingabe
		if (document.getElementsByName("F1")[0].checked==false && document.getElementsByName("F1")[1].checked==false && document.getElementsByName("F1")[2].checked==false && document.getElementsByName("F1")[3].checked==false) {
        	antwort[1]=0
        	document.getElementById("Q1").style.backgroundColor="lightpink"
    	}
	
    	if (document.getElementsByName("F2")[0].checked==false && document.getElementsByName("F2")[1].checked==false && document.getElementsByName("F2")[2].checked==false && document.getElementsByName("F2")[3].checked==false) {
        	antwort[2]=0
        	document.getElementById("Q2").style.backgroundColor="lightpink"        
    	}

    	if (document.getElementsByName("F3")[0].checked==false && document.getElementsByName("F3")[1].checked==false && document.getElementsByName("F3")[2].checked==false && document.getElementsByName("F3")[3].checked==false) {
        	antwort[3]=0
        	document.getElementById("Q3").style.backgroundColor="lightpink" 
    	}

    	if (document.getElementsByName("F4")[0].checked==false && document.getElementsByName("F4")[1].checked==false && document.getElementsByName("F4")[2].checked==false && document.getElementsByName("F4")[3].checked==false) {
        	antwort[4]=0
        	document.getElementById("Q4").style.backgroundColor="lightpink" 
    	}

    	if (document.getElementsByName("F5")[0].checked==false && document.getElementsByName("F5")[1].checked==false && document.getElementsByName("F5")[2].checked==false && document.getElementsByName("F5")[3].checked==false) {
        	antwort[5]=0
        	document.getElementById("Q5").style.backgroundColor="lightpink" 
    	}

    	if (document.getElementsByName("F6")[0].checked==false && document.getElementsByName("F6")[1].checked==false && document.getElementsByName("F6")[2].checked==false && document.getElementsByName("F6")[3].checked==false) {
        	antwort[6]=0
        	document.getElementById("Q6").style.backgroundColor="lightpink" 
    	}
 
    	if (document.getElementsByName("F7")[0].checked==false && document.getElementsByName("F7")[1].checked==false && document.getElementsByName("F7")[2].checked==false && document.getElementsByName("F7")[3].checked==false) {
        	antwort[7]=0
        	document.getElementById("Q7").style.backgroundColor="lightpink" 
    	}
	
    	if (document.getElementsByName("F8")[0].checked==false && document.getElementsByName("F8")[1].checked==false && document.getElementsByName("F8")[2].checked==false && document.getElementsByName("F8")[3].checked==false) {
        	antwort[8]=0
        	document.getElementById("Q8").style.backgroundColor="lightpink" 
    	}
	
    	if (document.getElementsByName("F9")[0].checked==false && document.getElementsByName("F9")[1].checked==false && document.getElementsByName("F9")[2].checked==false && document.getElementsByName("F9")[3].checked==false) {
        	antwort[9]=0
        	document.getElementById("Q9").style.backgroundColor="lightpink" 
    	}
	
    	if (document.getElementsByName("F10")[0].checked==false && document.getElementsByName("F10")[1].checked==false && document.getElementsByName("F10")[2].checked==false && document.getElementsByName("F10")[3].checked==false) {
        	antwort[10]=0
        	document.getElementById("Q10").style.backgroundColor="lightpink" 
    	}
	
    	if (document.getElementsByName("F11")[0].checked==false && document.getElementsByName("F11")[1].checked==false && document.getElementsByName("F11")[2].checked==false && document.getElementsByName("F11")[3].checked==false) {
        	antwort[11]=0
        	document.getElementById("Q11").style.backgroundColor="lightpink" 
    	}

    	if (document.getElementsByName("F12")[0].checked==false && document.getElementsByName("F12")[1].checked==false && document.getElementsByName("F12")[2].checked==false && document.getElementsByName("F12")[3].checked==false) {
        	antwort[12]=0
        	document.getElementById("Q12").style.backgroundColor="lightpink" 
    	}

    	if (document.getElementsByName("F13")[0].checked==false && document.getElementsByName("F13")[1].checked==false && document.getElementsByName("F13")[2].checked==false && document.getElementsByName("F13")[3].checked==false) {
        	antwort[13]=0
        	document.getElementById("Q13").style.backgroundColor="lightpink" 
    	}

    	if (document.getElementsByName("F14")[0].checked==false && document.getElementsByName("F14")[1].checked==false && document.getElementsByName("F14")[2].checked==false && document.getElementsByName("F14")[3].checked==false) {
        	antwort[14]=0
        	document.getElementById("Q14").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F15")[0].checked==false && document.getElementsByName("F15")[1].checked==false && document.getElementsByName("F15")[2].checked==false && document.getElementsByName("F15")[3].checked==false) {
        	antwort[15]=0
        	document.getElementById("Q15").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F16")[0].checked==false && document.getElementsByName("F16")[1].checked==false && document.getElementsByName("F16")[2].checked==false && document.getElementsByName("F16")[3].checked==false) {
        	antwort[16]=0
        	document.getElementById("Q16").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F17")[0].checked==false && document.getElementsByName("F17")[1].checked==false && document.getElementsByName("F17")[2].checked==false && document.getElementsByName("F17")[3].checked==false) {
        	antwort[17]=0
        	document.getElementById("Q17").style.backgroundColor="lightpink" 
    	}
		if (document.getElementsByName("F18")[0].checked==false && document.getElementsByName("F18")[1].checked==false && document.getElementsByName("F18")[2].checked==false && document.getElementsByName("F18")[3].checked==false) {
        	antwort[18]=0
        	document.getElementById("Q18").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F19")[0].checked==false && document.getElementsByName("F19")[1].checked==false && document.getElementsByName("F19")[2].checked==false && document.getElementsByName("F19")[3].checked==false) {
        	antwort[19]=0
        	document.getElementById("Q19").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F20")[0].checked==false && document.getElementsByName("F20")[1].checked==false && document.getElementsByName("F20")[2].checked==false && document.getElementsByName("F20")[3].checked==false) {
        	antwort[20]=0
        	document.getElementById("Q20").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F21")[0].checked==false && document.getElementsByName("F21")[1].checked==false && document.getElementsByName("F21")[2].checked==false && document.getElementsByName("F21")[3].checked==false) {
        	antwort[21]=0
        	document.getElementById("Q21").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F22")[0].checked==false && document.getElementsByName("F22")[1].checked==false && document.getElementsByName("F22")[2].checked==false && document.getElementsByName("F22")[3].checked==false) {
        	antwort[22]=0
        	document.getElementById("Q22").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F23")[0].checked==false && document.getElementsByName("F23")[1].checked==false && document.getElementsByName("F23")[2].checked==false && document.getElementsByName("F23")[3].checked==false) {
        	antwort[23]=0
        	document.getElementById("Q23").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F24")[0].checked==false && document.getElementsByName("F24")[1].checked==false && document.getElementsByName("F24")[2].checked==false && document.getElementsByName("F24")[3].checked==false) {
        	antwort[24]=0
        	document.getElementById("Q24").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F25")[0].checked==false && document.getElementsByName("F25")[1].checked==false && document.getElementsByName("F25")[2].checked==false && document.getElementsByName("F25")[3].checked==false) {
        	antwort[25]=0
        	document.getElementById("Q25").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F26")[0].checked==false && document.getElementsByName("F26")[1].checked==false && document.getElementsByName("F26")[2].checked==false && document.getElementsByName("F26")[3].checked==false) {
        	antwort[26]=0
        	document.getElementById("Q26").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F27")[0].checked==false && document.getElementsByName("F27")[1].checked==false && document.getElementsByName("F27")[2].checked==false && document.getElementsByName("F27")[3].checked==false) {
        	antwort[27]=0
        	document.getElementById("Q27").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F28")[0].checked==false && document.getElementsByName("F28")[1].checked==false && document.getElementsByName("F28")[2].checked==false && document.getElementsByName("F28")[3].checked==false) {
        	antwort[28]=0
        	document.getElementById("Q28").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F29")[0].checked==false && document.getElementsByName("F29")[1].checked==false && document.getElementsByName("F29")[2].checked==false && document.getElementsByName("F29")[3].checked==false) {
        	antwort[29]=0
        	document.getElementById("Q29").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F30")[0].checked==false && document.getElementsByName("F30")[1].checked==false && document.getElementsByName("F30")[2].checked==false && document.getElementsByName("F30")[3].checked==false) {
        	antwort[30]=0
        	document.getElementById("Q30").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F31")[0].checked==false && document.getElementsByName("F31")[1].checked==false && document.getElementsByName("F31")[2].checked==false && document.getElementsByName("F31")[3].checked==false) {
        	antwort[31]=0
        	document.getElementById("Q31").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F32")[0].checked==false && document.getElementsByName("F32")[1].checked==false && document.getElementsByName("F32")[2].checked==false && document.getElementsByName("F32")[3].checked==false) {
        	antwort[32]=0
        	document.getElementById("Q32").style.backgroundColor="lightpink" 
    	}

		if (document.getElementsByName("F33")[0].checked==false && document.getElementsByName("F33")[1].checked==false && document.getElementsByName("F33")[2].checked==false && document.getElementsByName("F33")[3].checked==false) {
        	antwort[33]=0
        	document.getElementById("Q33").style.backgroundColor="lightpink" 
    	}
		// anzeige der fehlenden Fragen
		// var j=0
		check_string=""
		for (var i = 1; i <= 33; i++){
			if (antwort[i]==0){
				check_string=check_string + antwort[i]
				j=j+1
			}
		}
        
	// loopuntil all questions checked
	// *******************************

	if (j>0){
		document.getElementById('check').value="Bislang " + (33- j) + " Fragen von 33 beantworten"
		document.getElementById('check1').value="Bislang " + (33- j) + " Fragen von 33 beantworten"
		}
	else{
        document.getElementById('check').value="alle Fragen ok "
		document.getElementById('check1').value="alle Fragen ok "

	// identifikation der Antwort und Anzeigen und sprung zu Result
	// target = "#Result";
	// $('html,body').animate({scrollTop: $(target)},'slow');
		//window.scrollBy({ top: 600, left: 0, behavior: "smooth" })
		window.scrollTo(0,2875)
		for (i=0;i<4;i++){
			if (document.getElementsByName("F1")[i].checked==true) {
				antwort[1]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F2")[i].checked==true) {
				antwort[2]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F3")[i].checked==true) {
				antwort[3]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F4")[i].checked==true) {
				antwort[4]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F5")[i].checked==true) {
				antwort[5]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F6")[i].checked==true) {
				antwort[6]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F7")[i].checked==true) {
				antwort[7]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F8")[i].checked==true) {
				antwort[8]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F9")[i].checked==true) {
				antwort[9]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F10")[i].checked==true) {
				antwort[10]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F11")[i].checked==true) {
				antwort[11]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F12")[i].checked==true) {
				antwort[12]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F13")[i].checked==true) {
				antwort[13]=i}
			}
		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[14]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[15]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[16]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[17]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[18]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[19]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[20]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[21]=i}
			}
	
		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[22]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[23]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[24]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[25]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[26]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[27]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[28]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[29]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[30]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[31]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[32]=i}
			}

		for (i=0;i<4;i++){
			if (document.getElementsByName("F14")[i].checked==true) {
				antwort[33]=i}
			}

		for (i=1;i<34;i++){
				if (antwort[i]==0) {antwort[i]=6}
				if (antwort[i]==1) {antwort[i]=4}
				if (antwort[i]==2) {antwort[i]=2}
				if (antwort[i]==3) {antwort[i]=0}
			}
		for (i=0;i<18;i++){
			sum[i]=0
			sum_max[i]=0
			for (ij=1;ij<34;ij++){
				sum[i]=sum[i]+antwort[ij]*bewertung[ij-1][i]
				sum_max[i]=sum_max[i]+6*bewertung[ij-1][i]}
		}

		console.log(" antwort: ",antwort, "sum", sum," sum_max ", sum_max)

		// Bestimmung des %-Erfüllungsgrades
		for (i=0;i<18;i++){
			ergebnis[i]=sum[i]/sum_max[i]
        }	

        // kopieren in mehrdimensionale Matrix
        var ergebnis_matrix = new Array(18);

        for (var i = 0; i < 18; i++) {
            ergebnis_matrix[i] = new Array(3);
        }
        
        for (i=0;i<18;i++){
                ergebnis_matrix[i][0]=kriterien[i]
                wert=ergebnis[i]*100   
                ergebnis_matrix[i][1]=wert
                if (wert>=80) {
                    ergebnis_matrix[i][2]= "Sehr empfehlenswert"
                }
                if (wert<80) {
                    ergebnis_matrix[i][2]= "empfehlenswert"
                }
                if (wert<65) {
                    ergebnis_matrix[i][2]= "bedingt empfehlenswert"
                }
                if (wert<50) {
                    ergebnis_matrix[i][2]= "eher uninteressant"
                }
        }
        console.log("ergebnis ", ergebnis_matrix)

        // Sortierung der Rangfolge (Größe) nach
		ergebnis_matrix.sort(function(a,b){
            return b[1]-a[1]
        })
        // empfehlung und farbige Markierung
        
        console.log("ergebnis ", ergebnis)
		for (i=0;i<18;i++){
			feld="Rang"+i
			document.getElementById(feld).value=i+1
			feld="Schnitt"+i
			document.getElementById(feld).value=ergebnis_matrix[i][0]
            feld="Wert"+i
            wert=ergebnis_matrix[i][1]
            document.getElementById(feld).value=wert.toFixed(1) + "% der möglichen Punkte"
            feld="Rat"+i
            document.getElementById(feld).value=ergebnis_matrix[i][2]
        }
        for (i=0;i<18;i++){
            feld="Rat"+i
            if (document.getElementById(feld).value=="Sehr empfehlenswert")
            {
                document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
                feld="Schnitt"+i
                document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
                feld="Wert"+i
                document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
                feld="Rang"+i
                document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
            }
            feld="Rat"+i
            if (document.getElementById(feld).value=="empfehlenswert")
            {
                document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'
                feld="Schnitt"+i
                document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'
                feld="Wert"+i
                document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'
                feld="Rang"+i
                document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'   
            }	
            feld="Rat"+i
            if (document.getElementById(feld).value=="bedingt empfehlenswert")
            {
                document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
                feld="Schnitt"+i
                document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
                feld="Wert"+i
                document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
                feld="Rang"+i
                document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
            }
            feld="Rat"+i
            if (document.getElementById(feld).value=="eher uninteressant")
            {
                document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
                feld="Schnitt"+i
                document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
                feld="Wert"+i
                document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
                feld="Rang"+i
                document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
            }
		}

	}
}

// check for  results buttons
// $('#button2').on("click", function() {
	function function_button1() {
		j=0
		document.getElementById('check').value="Bitte die 33 Fragen beantworten"
		document.getElementById('check1').value="Bitte die 33 Fragen beantworten"
		for (var i = 1; i <= 33; i++){
				antwort[i]=1
		}
        window.scrollTo(0,780)
		// set default color
		document.getElementById("Q1").style.backgroundColor="floralwhite"
		document.getElementById("Q2").style.backgroundColor="floralwhite"
		document.getElementById("Q3").style.backgroundColor="floralwhite"
		document.getElementById("Q4").style.backgroundColor="floralwhite"
		document.getElementById("Q5").style.backgroundColor="floralwhite"
		document.getElementById("Q6").style.backgroundColor="floralwhite"
		document.getElementById("Q7").style.backgroundColor="floralwhite"
		document.getElementById("Q8").style.backgroundColor="floralwhite"
		document.getElementById("Q9").style.backgroundColor="floralwhite"
		document.getElementById("Q10").style.backgroundColor="floralwhite"
		document.getElementById("Q11").style.backgroundColor="floralwhite"
		document.getElementById("Q12").style.backgroundColor="floralwhite"
		document.getElementById("Q13").style.backgroundColor="floralwhite"
		document.getElementById("Q14").style.backgroundColor="floralwhite"
		document.getElementById("Q15").style.backgroundColor="floralwhite"
		document.getElementById("Q16").style.backgroundColor="floralwhite"
		document.getElementById("Q17").style.backgroundColor="floralwhite"
		document.getElementById("Q18").style.backgroundColor="floralwhite"
		document.getElementById("Q19").style.backgroundColor="floralwhite"
		document.getElementById("Q20").style.backgroundColor="floralwhite"
		document.getElementById("Q21").style.backgroundColor="floralwhite"
		document.getElementById("Q22").style.backgroundColor="floralwhite"
		document.getElementById("Q23").style.backgroundColor="floralwhite"
		document.getElementById("Q24").style.backgroundColor="floralwhite"
		document.getElementById("Q25").style.backgroundColor="floralwhite"
		document.getElementById("Q26").style.backgroundColor="floralwhite"
		document.getElementById("Q27").style.backgroundColor="floralwhite"
		document.getElementById("Q28").style.backgroundColor="floralwhite"
		document.getElementById("Q29").style.backgroundColor="floralwhite"
		document.getElementById("Q30").style.backgroundColor="floralwhite"
		document.getElementById("Q31").style.backgroundColor="floralwhite"
		document.getElementById("Q32").style.backgroundColor="floralwhite"
		document.getElementById("Q33").style.backgroundColor="floralwhite"

		// test ob alle Fragen beantwortet muss getriggert werden durch neue Eingabe
			if (document.getElementsByName("F1")[0].checked==false && document.getElementsByName("F1")[1].checked==false && document.getElementsByName("F1")[2].checked==false && document.getElementsByName("F1")[3].checked==false) {
				antwort[1]=0
				document.getElementById("Q1").style.backgroundColor="lightpink"
			}
		
			if (document.getElementsByName("F2")[0].checked==false && document.getElementsByName("F2")[1].checked==false && document.getElementsByName("F2")[2].checked==false && document.getElementsByName("F2")[3].checked==false) {
				antwort[2]=0
				document.getElementById("Q2").style.backgroundColor="lightpink"        
			}
	
			if (document.getElementsByName("F3")[0].checked==false && document.getElementsByName("F3")[1].checked==false && document.getElementsByName("F3")[2].checked==false && document.getElementsByName("F3")[3].checked==false) {
				antwort[3]=0
				document.getElementById("Q3").style.backgroundColor="lightpink" 
			}
	
			if (document.getElementsByName("F4")[0].checked==false && document.getElementsByName("F4")[1].checked==false && document.getElementsByName("F4")[2].checked==false && document.getElementsByName("F4")[3].checked==false) {
				antwort[4]=0
				document.getElementById("Q4").style.backgroundColor="lightpink" 
			}
	
			if (document.getElementsByName("F5")[0].checked==false && document.getElementsByName("F5")[1].checked==false && document.getElementsByName("F5")[2].checked==false && document.getElementsByName("F5")[3].checked==false) {
				antwort[5]=0
				document.getElementById("Q5").style.backgroundColor="lightpink" 
			}
	
			if (document.getElementsByName("F6")[0].checked==false && document.getElementsByName("F6")[1].checked==false && document.getElementsByName("F6")[2].checked==false && document.getElementsByName("F6")[3].checked==false) {
				antwort[6]=0
				document.getElementById("Q6").style.backgroundColor="lightpink" 
			}
	 
			if (document.getElementsByName("F7")[0].checked==false && document.getElementsByName("F7")[1].checked==false && document.getElementsByName("F7")[2].checked==false && document.getElementsByName("F7")[3].checked==false) {
				antwort[7]=0
				document.getElementById("Q7").style.backgroundColor="lightpink" 
			}
		
			if (document.getElementsByName("F8")[0].checked==false && document.getElementsByName("F8")[1].checked==false && document.getElementsByName("F8")[2].checked==false && document.getElementsByName("F8")[3].checked==false) {
				antwort[8]=0
				document.getElementById("Q8").style.backgroundColor="lightpink" 
			}
		
			if (document.getElementsByName("F9")[0].checked==false && document.getElementsByName("F9")[1].checked==false && document.getElementsByName("F9")[2].checked==false && document.getElementsByName("F9")[3].checked==false) {
				antwort[9]=0
				document.getElementById("Q9").style.backgroundColor="lightpink" 
			}
		
			if (document.getElementsByName("F10")[0].checked==false && document.getElementsByName("F10")[1].checked==false && document.getElementsByName("F10")[2].checked==false && document.getElementsByName("F10")[3].checked==false) {
				antwort[10]=0
				document.getElementById("Q10").style.backgroundColor="lightpink" 
			}
		
			if (document.getElementsByName("F11")[0].checked==false && document.getElementsByName("F11")[1].checked==false && document.getElementsByName("F11")[2].checked==false && document.getElementsByName("F11")[3].checked==false) {
				antwort[11]=0
				document.getElementById("Q11").style.backgroundColor="lightpink" 
			}
	
			if (document.getElementsByName("F12")[0].checked==false && document.getElementsByName("F12")[1].checked==false && document.getElementsByName("F12")[2].checked==false && document.getElementsByName("F12")[3].checked==false) {
				antwort[12]=0
				document.getElementById("Q12").style.backgroundColor="lightpink" 
			}
	
			if (document.getElementsByName("F13")[0].checked==false && document.getElementsByName("F13")[1].checked==false && document.getElementsByName("F13")[2].checked==false && document.getElementsByName("F13")[3].checked==false) {
				antwort[13]=0
				document.getElementById("Q13").style.backgroundColor="lightpink" 
			}
	
			if (document.getElementsByName("F14")[0].checked==false && document.getElementsByName("F14")[1].checked==false && document.getElementsByName("F14")[2].checked==false && document.getElementsByName("F14")[3].checked==false) {
				antwort[14]=0
				document.getElementById("Q14").style.backgroundColor="lightpink" 
			}
			// anzeige der fehlenden Fragen
			// var j=0
			check_string=""
			for (var i = 1; i <= 14; i++){
				if (antwort[i]==0){
					check_string=check_string + antwort[i]
					j=j+1
				}
			}
			
		// loopuntil all questions checked
		// *******************************
	
		if (j>0){
			document.getElementById('check').value="Bislang " + (33- j) + " Fragen von 33 beantworten"
			document.getElementById('check1').value="Bislang " + (33- j) + " Fragen von 33 beantworten"
			}
		else{
			document.getElementById('check').value="alle Fragen ok "
			document.getElementById('check1').value="alle Fragen ok "
		// identifikation der Antwort und Anzeigen und sprung zu Result
		// target = "#Result";
		// $('html,body').animate({scrollTop: $(target)},'slow');
			//window.scrollBy({ top: 600, left: 0, behavior: "smooth" })
			window.scrollTo(0,2875)
			for (i=0;i<4;i++){
				if (document.getElementsByName("F1")[i].checked==true) {
					antwort[1]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F2")[i].checked==true) {
					antwort[2]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F3")[i].checked==true) {
					antwort[3]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F4")[i].checked==true) {
					antwort[4]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F5")[i].checked==true) {
					antwort[5]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F6")[i].checked==true) {
					antwort[6]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F7")[i].checked==true) {
					antwort[7]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F8")[i].checked==true) {
					antwort[8]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F9")[i].checked==true) {
					antwort[9]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F10")[i].checked==true) {
					antwort[10]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F11")[i].checked==true) {
					antwort[11]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F12")[i].checked==true) {
					antwort[12]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F13")[i].checked==true) {
					antwort[13]=i}
				}
			for (i=0;i<4;i++){
				if (document.getElementsByName("F14")[i].checked==true) {
					antwort[14]=i}
				}
			for (i=1;i<15;i++){
					if (antwort[i]==0) {antwort[i]=6}
					if (antwort[i]==1) {antwort[i]=4}
					if (antwort[i]==2) {antwort[i]=2}
					if (antwort[i]==3) {antwort[i]=0}
				}
			for (i=0;i<18;i++){
				sum[i]=0
				sum_max[i]=0
				for (ij=1;ij<15;ij++){
					sum[i]=sum[i]+antwort[ij]*bewertung[ij-1][i]
					sum_max[i]=sum_max[i]+6*bewertung[ij-1][i]}
			}
	
			console.log(" antwort: ",antwort, "sum", sum," sum_max ", sum_max)
	
			// Bestimmung des %-Erfüllungsgrades
			for (i=0;i<18;i++){
				ergebnis[i]=sum[i]/sum_max[i]
			}	
	
			// kopieren in mehrdimensionale Matrix
			var ergebnis_matrix = new Array(18);
	
			for (var i = 0; i < 18; i++) {
				ergebnis_matrix[i] = new Array(3);
			}
			
			for (i=0;i<18;i++){
					ergebnis_matrix[i][0]=kriterien[i]
					wert=ergebnis[i]*100   
					ergebnis_matrix[i][1]=wert
					if (wert>=80) {
						ergebnis_matrix[i][2]= "Sehr empfehlenswert"
					}
					if (wert<80) {
						ergebnis_matrix[i][2]= "empfehlenswert"
					}
					if (wert<65) {
						ergebnis_matrix[i][2]= "bedingt empfehlenswert"
					}
					if (wert<50) {
						ergebnis_matrix[i][2]= "eher uninteressant"
					}
			}

			// Sortierung der Rangfolge (Größe) nach
			ergebnis_matrix.sort(function(a,b){
				return b[1]-a[1]
			})
			// empfehlung und farbige Markierung
			
			console.log("ergebnis ", ergebnis)
			for (i=0;i<18;i++){
				feld="Rang"+i
				document.getElementById(feld).value=i+1
				feld="Schnitt"+i
				document.getElementById(feld).value=ergebnis_matrix[i][0]
				feld="Wert"+i
				wert=ergebnis_matrix[i][1]
				document.getElementById(feld).value=wert.toFixed(1) + "% der möglichen Punkte"
				feld="Rat"+i
				document.getElementById(feld).value=ergebnis_matrix[i][2]
			}
			for (i=0;i<18;i++){
				feld="Rat"+i
				if (document.getElementById(feld).value=="Sehr empfehlenswert")
				{
					document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
					feld="Schnitt"+i
					document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
					feld="Wert"+i
					document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
					feld="Rang"+i
					document.getElementById(feld).style.backgroundColor='rgb(146,208,63)'
				}
				feld="Rat"+i
				if (document.getElementById(feld).value=="empfehlenswert")
				{
					document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'
					feld="Schnitt"+i
					document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'
					feld="Wert"+i
					document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'
					feld="Rang"+i
					document.getElementById(feld).style.backgroundColor='rgb(197,224,180)'   
				}	
				feld="Rat"+i
				if (document.getElementById(feld).value=="bedingt empfehlenswert")
				{
					document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
					feld="Schnitt"+i
					document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
					feld="Wert"+i
					document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
					feld="Rang"+i
					document.getElementById(feld).style.backgroundColor='rgb(251,229,214)'
				}
				feld="Rat"+i
				if (document.getElementById(feld).value=="eher uninteressant")
				{
					document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
					feld="Schnitt"+i
					document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
					feld="Wert"+i
					document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
					feld="Rang"+i
					document.getElementById(feld).style.backgroundColor='rgb(248,203,173)'
				}
			}
	
		}

}

// ----------------------------------------
// ### EXECUTE 
// ----------------------------------------
initialize_page() 

// ---------------------------------------