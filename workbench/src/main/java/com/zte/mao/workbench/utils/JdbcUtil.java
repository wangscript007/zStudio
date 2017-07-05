package com.zte.mao.workbench.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class JdbcUtil {

    public static Connection getConnection(String driverName, String url) throws ClassNotFoundException, SQLException {
        Class.forName(driverName);
        return DriverManager.getConnection(url);
    }

    public static Connection getConnection(String driverName, String url, String username, String password)
            throws ClassNotFoundException, SQLException {
        Class.forName(driverName);
        return DriverManager.getConnection(url, username, password);
    }

    public static Statement getStatement(String driverName, String url) throws ClassNotFoundException, SQLException {
        return getConnection(driverName, url).createStatement();
    }

    public static Statement getStatement(String driverName, String url, String username, String password)
            throws ClassNotFoundException, SQLException {
        return getConnection(driverName, url, username, password).createStatement();
    }

    public static PreparedStatement getPrepareStatement(String driverName, String url, String sql)
            throws ClassNotFoundException, SQLException {
        return getConnection(driverName, url).prepareStatement(sql);
    }

    public static PreparedStatement getPrepareStatement(String driverName, String url, String username,
            String password, String sql) throws ClassNotFoundException, SQLException {
        return getConnection(driverName, url, username, password).prepareStatement(sql);
    }

    public static void closeAll(ResultSet rst, Statement stmt, Connection conn) throws SQLException {
        closeResultSet(rst);
        closeStatement(stmt);
        closeConnection(conn);
    }

    public static void closeAll(Statement stmt, Connection conn) throws SQLException {
        closeStatement(stmt);
        closeConnection(conn);
    }

    public static void closeAll(ResultSet rst, PreparedStatement preparedStatement, Connection conn)
            throws SQLException {
        closeResultSet(rst);
        closeStatement(preparedStatement);
        closeConnection(conn);
    }

    public static void closeAll(PreparedStatement preparedStatement, Connection conn) throws SQLException {
        closeStatement(preparedStatement);
        closeConnection(conn);
    }

    public static void closeConnection(Connection conn) throws SQLException {
        if (conn != null) {
            conn.close();
        }
    }

    public static void closeStatement(Statement stmt) throws SQLException {
        if (stmt != null) {
            stmt.close();
        }
    }

    public static void closeStatement(PreparedStatement preparedStatement) throws SQLException {
        if (preparedStatement != null) {
            preparedStatement.close();
        }
    }

    public static void closeResultSet(ResultSet rst) throws SQLException {
        if (rst != null) {
            rst.close();
        }
    }
}
