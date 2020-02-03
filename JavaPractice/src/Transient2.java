import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class Transient2 implements Serializable {

	int i=10,j=20;
	transient int k=30;
	transient static int l =40;
	transient final int m = 50;
	
	
	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception{
		
		Transient2 t = new Transient2();
		FileOutputStream fs = new FileOutputStream("sr.ser");
		ObjectOutputStream os = new ObjectOutputStream(fs);
		
		os.writeObject(t);
		
		FileInputStream fis = new FileInputStream("sr.ser");
		ObjectInputStream ois = new ObjectInputStream(fis);
		
		Transient2 ts = (Transient2) ois.readObject();
		System.out.println(ts.k);
		
		
	}
}
