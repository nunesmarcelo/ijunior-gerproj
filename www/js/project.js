/*global $, project, PROJETO, do_ajax, CLIENTE, IError, SError, show_info, parseData, parse*/

$(document).ready(function(){
    list_projects();
    if(!isNaN(document.location.hash.substr(1)) && document.location.hash.substr(1)!=""){
        show_project(document.location.hash.substr(1));
    }
    $('#m_aep, #m_sp, #m_dp').on('hidden.bs.modal', function () {
        document.location.replace("#");
    });
    $('#m_aep').on('shown.bs.modal', function () {
        $("#codinome").focus();
    });
    $('#m_sp').on('shown.bs.modal', function () {
        $("#m_sp button[data-dismiss=\"modal\"]")[0].focus()
    });
    $('#m_dp').on('shown.bs.modal', function () {
        $("#m_dp button[data-dismiss=\"modal\"]")[0].focus()
    });
});

var k =0;
function do_search(){
    clearTimeout(k);
    k = setTimeout(function(){list_projects()},500);
}

function get_project(id,callback){
    if(typeof(project)=="undefined") project={id:-1};
    if(project.id!=id){
        //grab info about the project via AJAX
        console.log("AJAX!!!!!!\nid: "+id);
        do_ajax(PROJETO+"?action=show",function(json){
            if(json.count==1){
                project = json.data[0]; //ajax response
                project.finalizado=parseInt(project.finalizado);
                if(typeof(callback)=="function") callback();
            }else{
                $(".modal").modal("hide");
                show_info("Projeto não encontrado","O projeto procurado não existe no banco de dados.");
                document.location.replace("#");
                list_projects();
            }
        },"id="+id)
    }else{
        if(typeof(callback)=="function") callback();
    }
}

function list_clients(value){
    console.log("Yeah! Clientes foram listados!");
    do_ajax(CLIENTE+"?action=search",function(json){
        if(json.status=="ok"){
            $('#cliente').html("");
            for (var i = 0; i < json.count; i++){
                $("#cliente")[0].innerHTML += "<option value=\""+json.data[i].id+"\">"+json.data[i].id+" - "+json.data[i].nome+", "+json.data[i].empresa+"</option>";
            }
            $('#cliente').prop("disabled", false).selectpicker('refresh');
            if(typeof(value)!="undefined") $('#cliente').selectpicker("val", value);
        }
    })
}

function list_projects(){
    //do AJAX here
    console.log("Listar!");
    project = {id:-1};
    var loading = '<tr><td colspan="5" style="text-align:center;font-size:2em" class="load_tr"><span class="glyphicon glyphicon-refresh loading" aria-hidden="true"></span></td></tr>';
    $('#list_proj_nc')[0].innerHTML+=loading;
    $('#list_proj_c')[0].innerHTML+=loading;

    do_ajax(PROJETO,function(json) {
        if(json.status=="ok"){
            $('#list_proj_nc, #list_proj_c').html("");
            for (var i = 0; i < json.count; i++){
                json.data[i].finalizado=parseInt(json.data[i].finalizado);
                var proj_table = "<tr>";
                proj_table += "<th scope=\"row\">"+(json.data[i].codinome == "" ? "-" : json.data[i].codinome)+"</th>";
                proj_table += "<td>"+json.data[i].nome+"</td>";
                proj_table += "<td><a href=\"cliente.html#"+json.data[i].cliente_id+"\">"+json.data[i].cliente+"</a></td>";
                proj_table += "<td>"+parseData((json.data[i].finalizado ? json.data[i].finalizacao : json.data[i].previsao))+"</td>";
                proj_table += '<td><button type="button" class="btn btn-primary" onclick="show_project('+json.data[i].id+')"><span class="glyphicon glyphicon glyphicon glyphicon-eye-open" aria-hidden="true"></span></button></td>';//glyphicon
                proj_table += "</tr>";
                (json.data[i].finalizado ? $('#list_proj_c')[0] : $('#list_proj_nc')[0]).innerHTML+=proj_table;
            }
            if($('#list_proj_nc').html()==""){
                $('#list_proj_nc').html('<tr><td colspan="5" style="text-align:center;font-size:1.5em" class="load_tr">Nenhum projeto encontrado.</td></tr>')
            }
            if($('#list_proj_c').html()==""){
                $('#list_proj_c').html('<tr><td colspan="5" style="text-align:center;font-size:1.5em" class="load_tr">Nenhum projeto encontrado.</td></tr>')
            }
        }else{
            IError();
            $('#list_proj_nc, #list_proj_c').html("");
        }
    },"q=" + encodeURIComponent($("#search").val()));
}

function show_project(id,show) {
    if(typeof(show)=="undefined" || show==true) $("#m_sp").modal("show");
    $("#btn_finalizar").html("<span class=\"glyphicon glyphicon-option-horizontal\"></span>").removeClass("btn-warning btn-success");
    $("#m_sp .campos_projeto").html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span> Carregando...");
    $("#stm").html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span> Carregando...");
    $("#m_sp .btn_editar, #m_sp .btn_excluir, #btn_finalizar").prop("disabled", true);
    $("#p_data_entrega").hide();
    get_project(id,function(){
        document.location.replace("#"+id);
        $("#m_sp .btn_editar")[0].onclick = function(){show_edit(id)};
        $("#m_sp .btn_excluir")[0].onclick = function(){show_delete(id,project.nome)};
        $("#btn_finalizar")[0].onclick = function(){finalize_project(id)};
        if(project.finalizado){
            $("#btn_finalizar").html("<span class=\"glyphicon glyphicon-minus\"></span>").addClass("btn-warning");
        }else{
            $("#btn_finalizar").html("<span class=\"glyphicon glyphicon-ok\"></span>").addClass("btn-success");
        }
        //escreve os campos (use valores da variável project);
        $("#stm").text((project.codinome != "" ? project.codinome+": " : "")+project.nome);
        $("#m_sp .campos_projeto")[0].innerHTML="<a href=\"cliente.html#"+project.cliente_id+"\">"+project.cliente+"</a>";
        $("#m_sp .campos_projeto")[1].innerText=parseData(project.assinatura);
        $("#m_sp .campos_projeto")[2].innerText=parseData(project.previsao);
        $("#m_sp .campos_projeto")[3].innerText=parseData(project.finalizacao);
        if(project.finalizado) $("#p_data_entrega").show();
        $("#m_sp .campos_projeto")[4].innerText=project.descricao;


        $("#m_sp .btn_editar, #m_sp .btn_excluir, #btn_finalizar").prop("disabled", false);
    });
}


//main
var edicao = false; //if !edicao then add project, else edit

function show_add(){
    edicao=false;
    $("#btn_do_project").prop( "disabled", false );
    $("form[name='fp'] input, form[name='fp'] textarea").val("").prop( "disabled", false );
    $('#cliente').html("<option value=\"c\">Carregando...</option>").prop("disabled", true).selectpicker('refresh').selectpicker("val","c");
    list_clients();
    $("#data_entrega").hide();
    $("#tm").text("Novo projeto");
    $("#btn_do_project").text("Adicionar");
    $("#m_aep").modal("show");
}

function show_edit(id){
    edicao=true;
    $("form[name='fp'] input, form[name='fp'] textarea").val("Carregando...").prop( "disabled", true );
    $('#cliente').html("<option value=\"c\">Carregando...</option>").prop("disabled", true).selectpicker('refresh').selectpicker("val","c");
    $("#tm").text("Editar projeto");
    $("#btn_do_project").text("Salvar alterações");
    $("#btn_do_project").prop( "disabled", true );
    $("#m_aep").modal("show");
    get_project(id,function(){
        //escreve os dados na tela, usando a variável project;
        $("form[name='fp'] input, form[name='fp'] textarea").prop( "disabled", false );
        $("#codinome").val(project.codinome);
        $("#nome").val(project.nome);
        list_clients(project.cliente_id);
        $("#assinatura").val(project.assinatura);
        $("#previsao").val(project.previsao);
        $("#finalizacao").val(project.finalizacao);
        $("#descricao").val(project.descricao);
        $("#id_projeto_e").val(id);
        if(project.finalizado){
            $("#finalizacao")[0].required=true; //so it complains when sending empty dates
            $("#finalizacao_p").show();
        }else{
            $("#finalizacao")[0].required=false;    //apparently, this doesn't work, because of the PHP, so...
            $("#finalizacao_p").hide();             //it stays here, of course.
        }
        $("#btn_do_project").prop( "disabled", false );
    });
}

function show_delete(id, nome){
    $("#btn_excluir_confirm").prop( "disabled", false ).html("Sim");
    $("#id_projeto_d").val(id);
    $("#s_nome_proj_d").text(nome);
    $("#m_dp").modal("show");
    $("#btn_excluir_confirm")[0].onclick = function(){ delete_project(id); };
    $("#btn_excluir_cancel")[0].onclick = function(){ show_project(id); };
}

function finalize_project(id){
    var args = "id="+id+"&finalizacao="+getDate();
    $("#btn_finalizar").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>").removeClass("btn-warning btn-success");
    do_ajax(PROJETO+"?action=finalize",function(json){
        if(json.status=="ok"){
            list_projects();
            show_project(id,false);
        }else{
            IError();
        }
    },args);
}

function do_project(){
    edicao ? edit_project() : add_project();
}


function add_project(){
    //Do the add project function
    // var args = "codinome="+parse("#codinome")+"&nome="+parse("#nome")+"&cliente="+parse("#cliente")+"&assinatura="+parse("#data_assinatura");
    //     args += "&previsao="+parse("#previsao_entrega")+"&descricao="+parse("#descricao");
    var args = $("#fp").serialize();
    $("#btn_do_project").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>");
    do_ajax(PROJETO+"?action=insert",function(json){
        if(json.status=="ok"){
            $("#m_aep").modal("hide");
            list_projects();
        }else if(json.status=="sql_error"){
            SError("adicionar");
            $("#btn_do_project").text("Adicionar");
            $("#btn_do_project").prop( "disabled", false );
        }else{
            IError();
            $("#btn_do_project").text("Adicionar");
            $("#btn_do_project").prop( "disabled", false );
        }
    },args);
}

function edit_project(){
    //Do the add project function
    // var args = "codinome="+parse("#codinome")+"&nome="+parse("#nome")+"&cliente="+parse("#cliente")+"&assinatura="+parse("#data_assinatura");
    //     args += "&previsao="+parse("#previsao_entrega")+"&finalizacao="+parse("#data_entrega_e")+"&id="+parse("#id_projeto_e")+"&descricao="+parse("#descricao");
    var args = "id="+$("#id_projeto_e").val() + "&" +$("#fp").serialize() + "&finalizado="+project.finalizado ;
    $("#btn_do_project").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>");
    do_ajax(PROJETO+"?action=update",function(json){
        if(json.status=="ok"){
            $("#m_aep").modal("hide");
            list_projects();
            show_project(parseInt($("#id_projeto_e").val()),false);
        }else if(json.status=="sql_error"){
            SError("editar");
            $("#btn_do_project").text("Salvar alterações");
            $("#btn_do_project").prop( "disabled", false );
        }else{
            IError();
            $("#btn_do_project").text("Salvar alterações");
            $("#btn_do_project").prop( "disabled", false );
        }
    },args);
}

function delete_project(id){
    var args = "id="+id;
    $("#btn_excluir_confirm").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>");
    do_ajax(PROJETO+"?action=destroy",function(json){
        $("#m_dp").modal("hide");
        list_projects();
        if(json.status!="ok"){
            IError();
        }
    },args);
}

//tm -> titulo modal
//fp -> form projeto
//m_aep -> modal projeto
//btn_do_project -> botão do_project
//bnc -> bad naming conventions
