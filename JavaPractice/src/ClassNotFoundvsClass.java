/**
 * Class not found vs no class defination error 
 * @author SV065115
 *
 */
class An{
	static int undefined = 1 / 0;
}

public class ClassNotFoundvsClass {
public static void main(String[] args) {
	
	  try {
          // The following line would throw ExceptionInInitializerError
		  An a = new An();
      } catch (Throwable t) {
          System.out.println(t);
      }
}
}
