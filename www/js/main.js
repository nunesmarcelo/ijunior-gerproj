/*global $*/

var project={id:-1}; //project object
var client={id:-1}; //project object
var PROJETO = "Projeto.php";
var CLIENTE = "Cliente.php";

$('.modal').on('hidden.bs.modal', function (e) {
    if($('.modal').hasClass('in')) {
    $('body').addClass('modal-open');
    }
});

function parse(e){
	return encodeURIComponent($(e).val());
};

function do_ajax(url, callback, args) {
    if(typeof(args)=="undefined") args="";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);
            if(typeof(callback)=="function") callback(json);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(args);
}

function parseData(str){
  if(typeof(str)=="string"){
    var d=str.split("-");
    if(d.length == 3){
      return d[2]+"/"+d[1]+"/"+d[0];
    }
  }
  return "Não cadastrado";
}

function show_info(title,content){
    $("#m_info_title").text(title);
    $("#m_info_content").html(content);
    $("#m_info").modal("show");
}

function getDate(){
	date = new Date();
	return date.getFullYear() + "-" + (date.getMonth() > 8 ? (date.getMonth()+1) : "0" + (date.getMonth() +1)) + "-"+date.getDate();
}

/*ERROS*/

function IError(){show_info("Erro interno do servidor", "O servidor retornou um erro inesperado. Por favor tente executar a ação novamente.");}
function SError(a){show_info("Erro ao "+a, "Um ou mais campos contém erros no preenchimento");}
