var gatewayURL = 'http://localhost/StatusAPI';

function getMessages() {
	jQuery.mobile.showPageLoadingMsg('Loading');
	$.ajax({
		url : gatewayURL + '/status',
		cache : false,
		type : 'GET',
		success : function(data, status, xhr) {
			jQuery.mobile.hidePageLoadingMsg();
			onGetMessages(data);
		},
		error : ajaxErrorHandler
	});
}

/**
 * Handle response from GET /status
 * 
 * @param response
 * @returns
 */
function onGetMessages(response) {
	messages = response._embedded.status;

	var newMessages = '';
	$.each(messages, function(index, item) {
		newMessages += '<li data-theme="">' + '<a href="#page2?msgId=' + index
				+ '" data-transition="none">' + item.message + '</a>' + '</li>';
	});
	$('#messages li[role!=heading]').remove();
	$('#messages').append(newMessages).listview('refresh');
}

function ajaxErrorHandler(xhr, ajaxOptions, thrownError) {
	jQuery.mobile.hidePageLoadingMsg();
	var msg = 'Ajax error. ';
	if (ajaxOptions.statusText != null && ajaxOptions.statusText != '')
		msg = msg + '<br/>' + ajaxOptions.statusText + '<br/>';
	else if (thrownError != null && thrownError != '')
		msg = msg + '<br/>' + thrownError + '<br/>';
	else if (xhr != null && xhr.statusText != null && xhr.statusText != '')
		msg = msg + '<br/>' + xhr.statusText + '<br/>';
	msg = msg + 'Trying static data!';
	$('#errorMessage').html(msg).show('slow', function() {
		onGetCustomers(customers);
		setTimeout(function() {
			$('#errorMessage').hide('slow');
		}, 1000);
	});
}

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp * 1000);
	var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
	return time;
}

$(document).ready(function() {
	$('#getListBtn').bind('click', getMessages);
	jQuery.support.cors = true;
	$('#messages li[role!=heading]').remove();
});

$(document).bind(
		'pagebeforechange',
		function(e, data) {
			if (typeof data.toPage === 'string') {
				var r = data.toPage.match(/page2\?msgId=(.*)/);
				if (r) {
					var message = messages[r[1]];
					if (message) {
						$("#msgId").html(message.id);
						$("#message").html(message.message);
						$("#author").html('From ' + message.user);
						$("#timestamp").html('Posted at ' + timeConverter(message.timestamp));
					}
				}
			}
		});
