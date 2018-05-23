/*global $, PROJETO, do_ajax, client, CLIENTE, IError, SError, show_info, parseData, parse*/

$(document).ready(function(){
    list_clients();
    if(!isNaN(document.location.hash.substr(1)) && document.location.hash.substr(1)!=""){
        show_client(document.location.hash.substr(1));
    }
    $('#m_aec, #m_sc, #m_dc').on('hidden.bs.modal', function () {
        document.location.replace("#");
    });
    $('#m_aec').on('shown.bs.modal', function () {
        $("#nome").focus();
    });
    $('#m_sc').on('shown.bs.modal', function () {
        $("#m_sc button[data-dismiss=\"modal\"]")[0].focus()
    });
    $('#m_dc').on('shown.bs.modal', function () {
        $("#m_dc button[data-dismiss=\"modal\"]")[0].focus()
    });
});


var k =0;
function do_search(){
    clearTimeout(k);
    k = setTimeout(function(){list_clients()},500);
}





function get_client(id,callback){
    if(typeof(client)=="undefined") client={id:-1};
    if(client.id!=id){
        //grab info about the client via AJAX
        console.log("this works");
        do_ajax(CLIENTE+"?action=show", function(json){
                if(json.count==1){
                    client = json.data[0]; //ajax response
                    client.finalizado=parseInt(client.finalizado);
                    if(typeof(callback)=="function") callback();
                }else{
                    $(".modal").modal("hide");
                    show_info("Cliente não encontrado","O cliente procurado não existe no banco de dados.");
                    document.location.replace("#");
                    list_clients();
                }

            },"id="+id);
    } else {
        if(typeof(callback)=="function") callback();
    }
}





function list_clients(){
    //do AJAX here
    client={id:-1};
    console.log("Listar!");

    var loading = '<tr><td colspan="5" style="text-align:center;font-size:2em" class="load_tr"><span class="glyphicon glyphicon-refresh loading" aria-hidden="true"></span></td></tr>';
    $('#list_client')[0].innerHTML+=loading;

    do_ajax(CLIENTE, function(json){
        console.log(json);
        if(json.status=="ok"){
            var table = $("#list_client")[0];
            table.innerHTML = "";
            for (var i = 0; i < json.count; i++){
                var client_table = "<tr id="+json.data[i].id+">";
                client_table += "<th scope=\"row\">"+json.data[i].nome+"</th>";
                client_table += "<td>"+(json.data[i].empresa == "" ? "Independente" : json.data[i].empresa)+"</td>";
                client_table += "<td>"+json.data[i].email+"</td>";
                client_table += '<td><button type="button" class="btn btn-primary" onclick="show_client('+json.data[i].id+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button></td>';
                client_table += "</tr>";
                $('#list_client')[0].innerHTML+=client_table;

            }
            if($('#list_client').html()==""){
                $('#list_client').html('<tr><td colspan="5" style="text-align:center;font-size:1.5em" class="load_tr">Nenhum cliente encontrado.</td></tr>')
            }
        }else{
            IError();
            $('#list_client').html("");
        }
    },"q="+ encodeURIComponent($("#search").val()));



}



function show_client(id, show) {
    if(typeof(show)=="undefined" || show==true) $("#m_sc").modal("show");
    $("#m_sc").modal("show");
    $("#m_sc .campos_cliente").html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span> Carregando...");
    $("#stm").html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span> Carregando...");
    $("#m_sc .btn_editar, #m_sc .btn_excluir").prop("disabled", true);
    get_client(id,function(){
        document.location.replace("#"+id);
        $("#m_sc .btn_editar").click(function(){show_edit(client.id)});
        $("#m_sc .btn_excluir").click(function(){show_delete(client.id,client.nome)});
        //escreve os campos (use valores da variável client);

        $("#stm").html(client.nome+"<br><small>"+(client.empresa == "" ? "Independente" : client.empresa)+"</small>");
        // $("#m_sc span.campos_cliente")[0].innerText=client.empresa;
        $("#m_sc span.campos_cliente")[0].innerText=client.telefixo;
        // $("#m_sc span.campos_cliente")[1].innerText=client.celular;
        $("#m_sc span.campos_cliente")[1].innerText=client.celular;
        $("#m_sc span.campos_cliente")[2].innerText=client.email;
        $("#m_sc span.campos_cliente")[3].innerText=client.endereco;
        $("#m_sc span.campos_cliente")[4].innerText=client.observacoes;
        if(client.celular == "") $("#optifone").hide();
        if(client.observacoes == "") $("#optobs").hide();

       var shown_projects = $("#client_projects");
       shown_projects[0].innerHTML = "";
       for (var i =0; i < client.projects.count; i++){
            shown_projects[0].innerHTML += "<p><a href='index.html#"+client.projects.data[i].id+"'>"+ (client.projects.data[i].codinome != "" ? "<strong>" + client.projects.data[i].codinome+"</strong>: " : "" )+client.projects.data[i].nome + "</a></p>"

        }
        if (shown_projects.html() == ""){
            shown_projects.html("<p>"+client.nome+" não possui nenhum projeto.</p>");
        }
        $("#m_sc .btn_editar, #m_sc .btn_excluir").prop("disabled", false);

    });
}


var edicao = false; //if !edicao then add client, else edit

function show_add(){
    edicao=false;
    $("#btn_do_client").prop( "disabled", false );
    $("form[name='fc'] input, form[name='fc'] textarea").val("").prop( "disabled", false );

    $("#tm").text("Novo cliente");
    $("#btn_do_client").text("Adicionar");
    $("#m_aec").modal("show");
}

function show_edit(id){
    edicao=true;
    $("form[name='fc'] input, form[name='fc'] textarea").val("Carregando...").prop( "disabled", true );
    $("#tm").text("Editar cliente");
    $("#btn_do_client").text("Salvar alterações");
    $("#btn_do_client").prop( "disabled", true );
    $("#m_aec").modal("show");
    get_client(id,function(){
        //escreve os dados na tela, usando a variável client;
        $("form[name='fc'] input, form[name='fc'] textarea").val(client.nome).prop( "disabled", false );


        $("#nome").val(client.nome);
        $("#empresa").val(client.empresa);
        $("#telefixo").val(client.telefixo);
        $("#celular").val(client.celular);
        $("#email").val(client.email);
        $("#endereco").val(client.endereco);
        $("#observacoes").val(client.observacoes);
        $("#id_cliente_e").val(id);

        $("#btn_do_client").prop( "disabled", false );


    });
}

function show_delete(id, nome){
    $("#btn_excluir_confirm").prop( "disabled", false ).html("Sim");
    $("#id_cliente_d").val(id);
    var delprojs = $("#associated_projects")[0];
    delprojs.innerHTML="";
    if (client.projects.data.length > 0){
        delprojs.innerHTML+= "<h4>Os Projetos a seguir serão deletados:</h4>"
        for(var i=0; i < client.projects.count; i++){
            delprojs.innerHTML+= "<p>"+(client.projects.data[i].codinome != "" ? "<strong>" + client.projects.data[i].codinome+"</strong>: " : "" )+client.projects.data[i].nome + "</p>";
        }
    }
    $("#s_nome_client_d").text(nome);
    $("#m_dc").modal("show");
    $("#btn_excluir_confirm").click( function(){ delete_client(id); });
    $("#btn_excluir_cancel").click(function(){ show_client(id); });

}



function do_client(){
    edicao ? edit_client() : add_client();
}

//Aparentemente funciona, mas precisamos de dropdown.


//precisamos mudar o cliente_id para cliente, e ainda por todos os clientes em um drop down. Como fazer?(principalmente porque o nome do cliente não é exclusivo!)
function add_client(){//WIP
    //Do the add client function
    var form = $("#fc");
    var args = form.serialize();
    $("#btn_do_project").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>");
    do_ajax(CLIENTE+"?action=insert", function(json){
        if(json.status=="ok"){
            $("#m_aec").modal("hide");
            list_clients();
        }else if(json.status=="sql_error"){
            SError("editar");
            $("#btn_do_client").text("Adicionar");
            $("#btn_do_client").prop( "disabled", false );
        }else{
            IError();
            $("#btn_do_client").text("Adicionar");
            $("#btn_do_client").prop( "disabled", false );
        }
    }, args);
}

function edit_client(){//WIP
    //Do the add client function
    var form = $("#fc");
    var args = "id=" + client.id + "&" +form.serialize();
    $("#btn_do_project").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>");
    do_ajax(CLIENTE+"?action=update", function(json){
        if(json.status=="ok"){
            $("#m_aec").modal("hide");
            list_clients();
            show_client(parseInt($("#id_cliente_e").val()),false);
        }else if(json.status=="sql_error"){
            SError("editar");
            $("#btn_do_client").text("Salvar alterações");
            $("#btn_do_client").prop( "disabled", false );
        }else{
            IError();
            $("#btn_do_client").text("Salvar alterações");
            $("#btn_do_client").prop( "disabled", false );
        }
    }, args);
    //if success
}



function delete_client(id, nome){//Done, but needs error checking.
    //Do the delete client function
    var args = "id="+id;
    $("#btn_excluir_confirm").prop( "disabled", true ).html("<span class=\"glyphicon glyphicon-refresh loading\" aria-hidden=\"true\"></span>");
    do_ajax(CLIENTE+"?action=destroy", function(json){
        $("#m_dc").modal("hide");
        list_clients();
         if(json.status!="ok"){
            IError();
        }

    }, args);

}
