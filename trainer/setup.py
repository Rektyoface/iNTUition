from setuptools import find_packages, setup

REQUIRED_PACKAGES = [
    'transformers==4.37.2',
    'datasets==2.16.1',
    'tokenizers>=0.14.1',
    'torch==2.1.2',
    'accelerate==0.25.0',
    'scikit-learn',
    'python-json-logger'
]

setup(
    name='trainer',
    version='0.1',
    install_requires=REQUIRED_PACKAGES,
    packages=find_packages(),
    include_package_data=True,
    description='My training application for change management AI'
)
