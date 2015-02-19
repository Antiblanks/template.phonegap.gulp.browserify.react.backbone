<% if (collection.length == 0) { %>
	<% if (emptyMessageSelector == "empty-message-default") { %>
		<div class="phone-contact-list-empty-message empty-message empty-message-default">
			<p>You have no contacts!</p>
		</div>
	<% } %>
<% } else { %>
	<ul class="phone-contact-list">
		<% _.each(collection.models, function(userModel) { %> 
			<li 
			class="phone-contact-list-item" 
			data-user-id="<%= userModel.get('id') %>" 
			data-user-cid="<%= userModel.cid %>" 
			data-user-full-name="<%= userModel.get('full_name') %>"
			data-user-first-name="<%= userModel.get('first_name') %>"
			data-user-last-name="<%= userModel.get('last_name') %>"
			data-user-email="<%= userModel.get('email') %>"
			data-user-phone="<%= userModel.get('phone') %>"
			data-user-date-of-birth="<%= userModel.get('date_of_birth') %>">
				<div class="contact-fullname">
					<%= userModel.get("full_name") %>
				</div>
			</li>
		<% }); %>
	</ul>
<% } %>