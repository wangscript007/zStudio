package com.zte.mao.common.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.zte.mao.common.exception.MaoCommonException;
import org.apache.log4j.Logger;

public class DBConnUtil {
    private static final Logger dmsg = Logger.getLogger(DBConnUtil.class.getName());

    public static void closeResultSet(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                dmsg.error(e.getMessage(), e);
            }
        }
    }

    public static void closeStatement(Statement statement) {
        if (statement != null) {
            try {
                statement.close();
            } catch (SQLException e) {
                dmsg.error(e.getMessage(), e);
            }
        }
    }

    public static void closeConnection( Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                dmsg.error(e.getMessage(), e);
            }
        }
    }

    public static void closeAll(ResultSet rs, Statement statement, Connection connection) {
        closeResultSet(rs);
        closeStatement(statement);
        closeConnection(connection);
    }

    public static void executeUpdate(Connection conn, String sql) throws MaoCommonException {
        if (conn == null) {
            dmsg.error("error:executeUpdate conn is null!");
            throw new MaoCommonException("error:executeUpdate conn is null!");
        }

        Statement statement = null;
        try {
            if (conn != null) {
                statement = conn.createStatement();
                statement.executeUpdate(sql);
            }
        } catch (SQLException e) {
            dmsg.error("error:executeUpdate ["+sql+"]failure:" + e.getMessage());
            throw new MaoCommonException(e.getMessage(), e);
        } finally {
            closeAll(null, statement, conn);
        }
    }

    public static Statement getStatement(Connection conn) throws MaoCommonException {
        Statement stmt = null;
        try {
            stmt = conn.createStatement();
        } catch (SQLException e) {
            dmsg.error("Can't get the db statement, error reason:" + e.getMessage());
            throw new MaoCommonException("Can't get the db statement, error reason:" + e.getMessage(), e);
        }
        return stmt;
    }
    
    public static PreparedStatement getPrepareStatement(Connection conn,String sql) throws MaoCommonException {
        PreparedStatement pStmt = null;
        try {
        	pStmt = conn.prepareStatement(sql);
        } catch (SQLException e) {
            dmsg.error("Can't get the db preparestatement, error reason:" + e.getMessage());
            throw new MaoCommonException("Can't get the db preparestatement, error reason:" + e.getMessage(), e);
        }
        return pStmt;
    }

    public static ResultSet getResultSet(Statement stmt, String sql) throws MaoCommonException {
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery(sql);
        } catch (SQLException e) {
            dmsg.error("Can't get the (" + sql + ")result, error reason:" + e.getMessage());

            throw new MaoCommonException("Can't get the (" + sql + ")result, error reason:" + e.getMessage(), e);
        }
        return rs;
    }
}
