import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBCExample {
	 public static void main(String[] args) throws SQLException {
	      try (
	         // Step 1: Allocate a database 'Connection' object
	         Connection conn = DriverManager.getConnection(
	               "jdbc:mysql://localhost:3306/ebookshop?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
	               "myuser", "xxxx"); // for MySQL only
	 
	         // Step 2: Allocate a 'Statement' object in the Connection
	         Statement stmt = conn.createStatement();
	      ) {
	    	  String strSelect = "select * from books";
	    	  ResultSet rs = stmt.executeQuery(strSelect);
	    	  while(rs.next()) {
	    		  System.out.println(rs.getInt("id"));
	    	  }
	    	  
	      }
	 }
}
