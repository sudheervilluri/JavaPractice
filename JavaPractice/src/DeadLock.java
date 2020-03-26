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

		String s1 = "Hello";
		String s2 = "World";

		Thread t1 = new Thread() {

			@Override
			public void run() {
				synchronized (s1) {
					System.out.println("Waiting for S1 from thread1");
					synchronized (s2) {
						System.out.println("Inside S2 from Thread1");
					}
				}

			}
		};

		Thread t2 = new Thread() {

			@Override
			public void run() {
				synchronized (s2) {
					System.out.println("Waiting for S1 from thread2");
					synchronized (s1) {
						System.out.println("Inside S2 from Thread2");
					}
				}

			}
		};
		
		t1.start();
		
		t2.start();
		t2.join();
		//t1.start();

	}

}
