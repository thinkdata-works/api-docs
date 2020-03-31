# Catalog API

We have gone through the process of getting a client setup and querying the data API, but it doesn't
stop there.  All functions of the Namara Catalog are available through the API and a complete list
of the supported functions are listed here.

## Organizations

The organization is the highest unit.  A user can be a member of many organizations and an organization
has many groups.

For list/get/create/update/delete operations on Organizations.

- **ListOrganization** - List organizations the requesting user is a member of.
- **CreateOrganization** - Creates a new organization with the current user as the owner
- **GetOrganization** - Gets an organization by id.  It will be limited to organizations the requesting
user is a member of.
- **UpdateOrganization** - Update an existing Organization.

```ruby
organiztion = {title: 'Some Org'}

organizations = namara.list_organizations
organization = namara.create_organization(organization)
organization = namara.get_organization('org-1')
organization = namara.update_organization(organization)
resp = namara.delete_organization(organization)
```

```python

```

```go

```

## Organization Members

For list/get/add/update/remove operations on Organization Members.

Note: A user must be a member of the organization to perform read operations on its users and be able
to manage members to perform add/remove/update operations on its members.

- **ListOrganizationMembers** - Lists organization members for a given organization.
- **AddOrganizationMember** - Add a member to an organization.
- **GetOrganizationMember** - Get a member by user id.   Useful to query the permission of
the Organization Member.
- **UpdateOrganizationMember** - Update a member's permission.

```ruby
member = {organization_id: 'org-1', user_id: 'u-1', permission: 1}

members = namara.list_organization_members('org-1')
member = namara.add_organization_member(member)
member = namara.get_organization_member('org-1', 'u-1')
member = namara.update_organization_member(member)
```

```python

```

```go

```

## Groups

For list/get/create/update/delete operations on Groups.

- **ListGroups** - List groups of an organization.  A user must be a member of the organization to list
its groups and only groups a user is a member of will be listed.
- **CreateGroup** - Create a group in the organization.
- **GetGroup** - Get a group by group id.
- **UpdateGroup** - Update an existing group.
- **DeleteGroup** - Delete an existing group.

```ruby
group = {organization_id: 'org-1', title: 'Some Group'}

groups = namara.list_groups('org-1')
group  = namara.create_group(group)
group = namara.get_group('grp-1', 'org-1')
group = namara.update_group(group)
response = namara.delete_group(group)
```

```python

```

```go

```

## Group Members

For list/get/add/update/remove operations on Group Members.

Note: A user must be a member of the group to perform read operations on its users and be an admin of the group to
perform add/remove/update operations.

- **ListGroupMembers** - Lists organization members for a given organization.
- **AddGroupMember** - Add a member to an organization.
- **GetGroupMember** - Get a member by user id.   Useful to query the permission of the Group Member.
- **UpdateGroupMember** - Update a member's permission.

```ruby
member = {group_id: 'grp-1', user_id: 'u-1', permission: 1}

members = namara.list_group_members('grp-1')
member = namara.add_group_member(member)
member = namara.get_group_member('grp-1', 'u-1')
member = namara.update_group_member(member)
response = namara.remove_group_member(member)
```

```python

```

```go

```

## Datasets

For search/get/update operations on Datasets.

- **ListAllDatasets** - List all datasets a user can access regardless of organization.
- **ListOrganizationDatasets** - List all datasets in an organization that a user has access to view.
- **GetDataset** - Get a dataset by id

```ruby
filter = {query: 'my search', limit: 10, offset: 0}

datasets = namara.list_all_datasets(filter)
datasets = namara.list_organization_datasets('org-1', filter)
dataset = namara.get_dataset('ds-1')
```

```python

```

```go

```

## Query

For query operations on Datasets.

- **Query**  - Query a dataset with a statement.  A user will only be able to query a dataset they have permission to
view.

```ruby
results = namara.query('SELECT ... FROM ...')
```

```python

```

```go

```

## Other

This does not include all API methods available and more will be added to the documentation soon.
