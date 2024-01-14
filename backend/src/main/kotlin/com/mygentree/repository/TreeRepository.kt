package com.mygentree.repository

import com.mygentree.data.Tree
import com.mygentree.data.TreeRole
import com.mygentree.data.TreeRoleName
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface TreeRepository : JpaRepository<Tree, Long> {
    @Query(
        value = """
select t.*, 
    user_trees.tree_id as tree_id,
    user_trees.user_id as user_id,
    user_trees.id as utid
from user_trees
    join trees t on user_trees.tree_id = t.id
    join users u on u.id = user_trees.user_id
    join user_app_roles uar on u.id = uar.user_id
    join user_tree_roles utr on user_trees.id = utr.user_trees_id
    join tree_roles tr on utr.role_id = tr.id
    join access_statuses acst on utr.access_status_id = acst.id
where u.id = :userId
    and acst.status = 'GRANTED'""",
        nativeQuery = true
    )
    fun findAllUserTrees(
       @Param("userId") userId: Long?
    ): Set<Tree>

    @Query(
        value = """
select t.*, 
    user_trees.tree_id as tree_id,
    user_trees.user_id as user_id,
    user_trees.id as utid 
from user_trees
    join trees t on user_trees.tree_id = t.id
    join users u on u.id = user_trees.user_id
    join user_app_roles uar on u.id = uar.user_id
    join user_tree_roles utr on user_trees.id = utr.user_trees_id
    join tree_roles tr on utr.role_id = tr.id
    join access_statuses acst on utr.access_status_id = acst.id
where u.id = :userId
    and t.id = :treeId
    and acst.status = 'GRANTED'""",
        nativeQuery = true
    )
    fun findTree(
       @Param("treeId") treeId: Long?,
       @Param("userId") userId: Long?
    ): Optional<Tree>

    @Query(
        value = """
select tr.*
from user_trees ut
    join user_tree_roles utr on utr.user_trees_id = ut.id
    join tree_roles tr on utr.role_id = tr.id
    join access_statuses acst on utr.access_status_id = acst.id
where ut.user_id = :userId
    and ut.tree_id = :treeId
    and acst.status = 'GRANTED'""",
        nativeQuery = true
    )
    fun getUserTreeRoles(
        @Param("treeId") treeId: Long?,
        @Param("userId") userId: Long?
    ): Set<TreeRole>

    @Query(
        value = """
insert into user_trees (user_id, tree_id) 
values 
(:userId, :treeId)
RETURNING id
""",
        nativeQuery = true
    )
    fun persistUserTreeRel(
        @Param("userId") userId: Long?,
        @Param("treeId") treeId: Long?
    ): Long

    @Query(
        value = """
insert into user_tree_roles (user_trees_id, role_id, access_status_id, updated_by) 
values 
(:userTreesId, :roleId, :accessStatusId, :updatedBy)
RETURNING id
""",
        nativeQuery = true
    )
    fun persistUserTreeRoleRel(
        @Param("userTreesId") userTreesId: Long,
        @Param("roleId") roleId: Long,
        @Param("accessStatusId") accessStatusId: Long,
        @Param("updatedBy") updatedBy: Long
    ): Long

}