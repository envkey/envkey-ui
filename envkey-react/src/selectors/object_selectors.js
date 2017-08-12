import db from 'lib/db'
import { defaultMemoize } from 'reselect'
import R from 'ramda'
import pluralize from 'pluralize'
import { orgRoleGroupLabel } from 'lib/ui'
import moment from 'moment'

db.init("apps", "users", "appUsers", "orgUsers", "servers")

export const

  getApps = db.apps.list({sortBy: "name"}),

  getUsers = db.users.list(),

  getUsersById = db.users.index(),

  getServers = db.servers.list(),

  getAppUsers = db.appUsers.list(),

  getAppsSortedByUpdatedAt = db.apps.list({
    sortBy: ({updatedAt})=> moment(updatedAt).valueOf(),
    reverse: true
  }),

  getServerGroupsForApp = db.apps.hasMany("servers", {
    groupBy: "role",
    sortBy: "createdAt"
  }),

  getAppUserBy = ({userId, appId}, state)=>{
    const fn = db.appUsers.where({appId, userId})
    return state ? fn(state)[0] : R.pipe(fn, R.head)
  },

  getAppUser = db.appUsers.find(),

  getUsersForApp = db.apps.hasAndBelongsToMany("users"),

  getApp = db.apps.find(),

  getAppBySlug = db.apps.findBy("slug"),

  getUser = db.users.find(),

  getUserBySlug = db.users.findBy("slug"),

  getUserGroupsByRole = db.users.group("role", {
    sortBy: "lastName"
  }),

  getNonOrgAdminUsers = db.users.whereNotIn(
    "role",
    ["org_owner", "org_admin"],
    {sortBy: "lastName"}
  ),

  getUserGroupsByRoleForApp = db.apps.hasAndBelongsToMany("users", {
    groupBy: ({relation}) => relation.role,
    sortBy: "lastName"
  }),

  getServersForApp = db.apps.hasMany("servers"),

  getKeyableServersForApp = db.apps.hasMany("servers", {
    where: {pubkey: R.complement(R.isNil)}
  }),

  getAppGroupsForUser = db.users.hasAndBelongsToMany("apps", {
    through: "appUsers",
    groupBy: ({relation}) => relation.role,
    sortBy: "name"
  }),

  getAppsForUser = db.users.hasAndBelongsToMany("apps", {
    through: "appUsers"
  }),

  getServer = db.servers.find(),

  getOrgUserForUser = db.orgUsers.findBy("userId"),

  getUserWithOrgUserBySlug = (slug, state)=> {
    const user = getUserBySlug(slug, state),
          orgUser = getOrgUserForUser(user.id, state)

    return R.assoc("orgUser", orgUser, user)
  },

  dissocRelations = R.map(R.dissoc("relation")),

  getSelectedObjectType = db.path("selectedObjectType"),

  getObject = R.curry((type, id, state)=>{
    return db(pluralize(type)).find()(id, state)
  }),

  getSelectedObjectId = db.path("selectedObjectId"),

  getSelectedObject = state => {
    const type = getSelectedObjectType(state),
          id = getSelectedObjectId(state)
    return getObject(type, id, state)
  },

  getOnboardAppId = db.path("onboardAppId")








