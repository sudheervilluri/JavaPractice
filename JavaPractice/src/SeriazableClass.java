import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

class A implements Serializable {
	int i = 10;

	A() {
		System.out.println(i);
	}
}

class B extends A {
	int i = 100;

	B() {
		System.out.println(i);
	}
}

public class SeriazableClass {
	public static void main(String[] args) throws Exception {

		B b = new B();

		FileOutputStream fs = new FileOutputStream("sts.ser");
		ObjectOutputStream oos = new ObjectOutputStream(fs);

		// Method for serialization of B's class object
		oos.writeObject(b);

		// closing streams
		oos.close();
		fs.close();

		FileInputStream fis = new FileInputStream("sts.ser");
		ObjectInputStream ois = new ObjectInputStream(fis);

		B b2 = (B)ois.readObject(); 
		System.out.println(b2.i);

	}
}
