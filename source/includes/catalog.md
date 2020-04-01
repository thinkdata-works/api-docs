# Catalog API

We have gone through the process of getting a client setup and querying the data API, but it doesn't
stop there.  All functions of the Namara Catalog are available through the API and a complete list
of the supported functions are listed here.

## Handling Pagination

Every request that returns a list of results will have pagination parameters that should be provided. `1000` results is both the default and maximum per request. For limits exceeding `1000`, either an error will be returned or a forced `1000` result limit will be applied. This may vary depending on the service. In any case, it is recommend that all listing requests have a pagination strategy.

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
org := &namara.Organization{Title: "Some Org"}
	
orgs, _ := client.ListOrganizations(ctx, namara.OrganizationFilter{})
org, _ = client.CreateOrganization(ctx, org)
org, _ = client.GetOrganization(ctx, "org-1")
org, _ = client.UpdateOrganization(ctx, org)
_ = client.DeleteOrganization(ctx, org)
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
- **RemoveOrganizationMember** - Remove a member from the organization.

```ruby
member = {organization_id: 'org-1', user_id: 'u-1', permission: 1}

members = namara.list_organization_members('org-1')
member = namara.add_organization_member(member)
member = namara.get_organization_member('org-1', 'u-1')
member = namara.update_organization_member(member)
member = namara.remove_organization_member(member)
```

```python

```

```go
mem := &namara.OrganizationMember{OrganizationId: "org-1", UserId: "u-1", Permission: 1}

mems, _ := client.ListOrganizationMembers(ctx, "org-1", &namara.OrganizationMembersFilter{})
mem, _ = client.AddOrganizationMember(ctx, mem)
mem, _ = client.GetOrganizationMember(ctx, "org-1", "u-1")
mem, _ = client.UpdateOrganizationMember(ctx, mem)
_ = client.RemoveOrganizationMember(ctx, mem)
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
grp := &namara.Group{OrganizationId: "org-1", Title: "Some Group"}

grps, _ := client.ListGroups(ctx, []string{"org-1"}, &namara.GroupsFilter{})
grp, _ = client.CreateGroup(ctx, grp)
grp, _ = client.GetGroup(ctx, "org-1", "grp-1")
grp, _ = client.UpdateGroup(ctx, grp)
_ = client.DeleteGroup(ctx, grp)
```

## Group Members

For list/get/add/update/remove operations on Group Members.

Note: A user must be a member of the group to perform read operations on its users and be an admin of the group to
perform add/remove/update operations.

- **ListGroupMembers** - Lists group members for a given organization.
- **AddGroupMember** - Add a member to an group.
- **GetGroupMember** - Get a member by user id.   Useful to query the permission of the Group Member.
- **UpdateGroupMember** - Update a member's permission.
- **RemoveGroupMember** - Remove a member from the group.

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
grpMem := &namara.GroupMember{GroupId: "grp-1", UserId: "u-1", Permission: 1}

grpMems, _ := client.ListGroupMembers(ctx, &namara.GroupMembersFilter{}, "grp-1")
grpMem, _ = client.AddGroupMember(ctx, grpMem)
grpMem, _ = client.GetGroupMember(ctx, "u-1", "grp-1")
grpMem, _ = client.UpdateGroupMember(ctx, grpMem)
_ = client.RemoveGroupMember(ctx, grpMem)
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
datasets, _ := client.ListDatasets(ctx, namara.DatasetFilter{Limit: 10, Offset: 0, Query: "my search"})
datasets, _ = client.ListOrganizationDatasets(ctx, "org-1", 
    &namara.OrganizationDatasetFilter{Limit: 10, Offset: 0, Query: "my search"})
dataset, _ := client.GetDataset(ctx, "ds-1")
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
results, _ := client.Query(ctx, "SELECT col1 FROM ...")
for results.Next() {
    row, _ := results.Result()
    row.GetString("col1")
}
```

## Other

This does not include all API methods available and more will be added to the documentation soon.
