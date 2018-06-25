/**
 * 
 */

/**
 * @author SVilluri
 *
 */
public class DeadLock {

	/**
	 * @param args
	 * @throws InterruptedException 
	 */
	public static void main(String[] args) throws InterruptedException {
		
		System.out.println("WElcome to Dead Lock");
		Thread.currentThread().join();
		System.out.println("End to Dead Lock");

	}

}
