function _update_page(resp) {
    for (i = 0; i < resp.allItems.length; i++) {
        var takeCell = $("td#take-item-" + resp.allItems[i].id);
        var untakeCell = $("td#untake-item-" + resp.allItems[i].id);
        var stateCell = $("td#action-shortcuts-" + resp.allItems[i].id);
        var stateItem = $(stateCell).attr("class").split(' ')[0].split('-')[2];
      var ownerItem = null;
        if (takeCell.length) {
            ownerItem = $(takeCell).attr("class").split(' ')[1].split('-')[1];
        } else {
            ownerItem = $(untakeCell).attr("class").split(' ')[1].split('-')[1];
        }
        resp.allItems[i].state = (resp.allItems[i].state == "None") ? ("None") : ((resp.allItems[i].state == 1) ? ("OK") : ("KO"));
        if (resp.allItems[i].state != stateItem) {
            var link = "/workflow/item/";
            link += (resp.allItems[i].state == "None") ? ("no_state/") : ("validate/");
            link += resp.allItems[i].id;
            link += (resp.allItems[i].state == "None") ? ("") : ((resp.allItems[i].state == 1) ? ("/OK/") : ("/KO/"));
            var el = $("td#action-shortcuts-" + resp.allItems[i].id).find("a.shortcut-disabled-" + resp.allItems[i].state);
            _update_item_shortcut(resp.allItems[i], link, el);
        }
        if (resp.allItems[i].person != ownerItem) {
            resp.allItems[i].item_id = resp.allItems[i].id;
            resp.allItems[i].assigned_to = resp.allItems[i].person;
            resp.allItems[i].assigned_to_lastname = resp.allItems[i].person_lastname;
            resp.allItems[i].assigned_to_firstname = resp.allItems[i].person_firstname;
            var linkItem = "/workflow/item/";
            var elItem = $("td#untake-item-" + resp.allItems[i].id);
            if (!(elItem.length)) {
                elItem = $("td#take-item-" + resp.allItems[i].id);
            }
            if (resp.allItems[i].person == "None") {
                linkItem += "untake/" + resp.allItems[i].id + '/';
                _update_item_reset_owner(resp.allItems[i], linkItem, elItem);
            } else {
                linkItem += "take/" + resp.allItems[i].id + '/';
                _update_item_add_owner(resp.allItems[i], linkItem, elItem);
            }
        }
    }
}

function update_statistics_filters() {
    $("input[type=radio]#filters-all + span").html(" All items (" + gl_total + ")");
    $("input[type=radio]#filters-mine + span").html(" My items (" + gl_mine + ")");
    $("input[type=radio]#filters-untaken + span").html(" Untaken (" + gl_untaken + ")");
    $("input[type=radio]#filters-taken + span").html(" Taken (" + gl_taken + ")");
    $("input[type=radio]#filters-successful + span").html(" Successful items (" + gl_success + ")");
    $("input[type=radio]#filters-failed + span").html(" Broken items (" + gl_failed + ")");

    $("#filters-" + location.pathname.split('/')[4]).attr("checked", "checked").parent().attr("style", "font-weight: bold;");
    if (location.pathname.split('/')[4] != "all") {
        $("div#sortable").removeAttr("id");
    } else {
        $("div#sortable").attr("id", "sortable");
    }
}

function update_statistics_progressbar() {
    $("span#stats-success").parent().html("<span id='stats-success'></span> Success: " + gl_success);
    $("span#stats-failed").parent().html("<span id='stats-failed'></span> Failed Miserably: " + gl_failed);
    $("span#stats-unsolved").parent().html("<span id='stats-unsolved'></span> Untested: " + gl_not_solved);
}


function intervalAjaxCall() {
    if (requestIntervalAjaxCall) {
        requestIntervalAjaxCall.abort();
    }
    var instanceID = $("div.categories_table_workflow").attr("id").split('-')[1];
    requestIntervalAjaxCall = $.ajax({
        url: '/workflow/getall/' + gl_workflowId + '/',
        type: 'POST',
        dataType: 'json',
        timeout: 3000,
        success: function (data) { _update_page(data); },
        error: function () {}
    });
   setTimeout("intervalAjaxCall()", 45000);
}
